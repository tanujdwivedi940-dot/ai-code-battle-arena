// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IReputationNFT {
    function mintWinnerBadge(
        address recipient,
        string memory tokenUri,
        string memory problemTitle,
        uint256 score
    ) external returns (uint256);
}

/**
 * @title BattleArena
 * @dev Manages 1v1 micro-stakes escrow on Polygon Amoy and pays out the AI-verified winner.
 */
contract BattleArena is Ownable, ReentrancyGuard {
    IReputationNFT public reputationNFT;
    address public refereeSigner;

    struct Battle {
        string roomId;
        address player1;
        address player2;
        uint256 stakeAmount;
        bool player1Staked;
        bool player2Staked;
        bool isSettled;
        address winner;
    }

    mapping(string => Battle) public battles;

    event BattleStaked(string indexed roomId, address indexed player, uint256 amount);
    event BattleSettled(string indexed roomId, address indexed winner, uint256 totalPayout);
    event BattleRefunded(string indexed roomId, address indexed player, uint256 refundAmount);

    constructor(address _refereeSigner) Ownable(msg.sender) {
        refereeSigner = _refereeSigner;
    }

    function setReputationNFT(address _nftContract) external onlyOwner {
        reputationNFT = IReputationNFT(_nftContract);
    }

    function setRefereeSigner(address _newSigner) external onlyOwner {
        refereeSigner = _newSigner;
    }

    /**
     * @dev Player deposits stake into room escrow (e.g. 0.005 POL).
     */
    function stake(string memory roomId) external payable nonReentrant {
        require(msg.value > 0, "Stake must be greater than 0");
        Battle storage b = battles[roomId];

        if (b.player1 == address(0)) {
            b.roomId = roomId;
            b.player1 = msg.sender;
            b.stakeAmount = msg.value;
            b.player1Staked = true;
        } else if (b.player2 == address(0)) {
            require(msg.sender != b.player1, "Cannot play against yourself in same slot");
            require(msg.value == b.stakeAmount, "Stake must match Player 1 amount");
            b.player2 = msg.sender;
            b.player2Staked = true;
        } else {
            revert("Battle room escrow is full");
        }

        emit BattleStaked(roomId, msg.sender, msg.value);
    }

    /**
     * @dev Settles the battle and transfers the entire pooled pot (2x stake) to the winner.
     */
    function settleBattle(
        string memory roomId,
        address payable winner,
        string memory problemTitle,
        uint256 winnerScore,
        string memory tokenUri
    ) external nonReentrant {
        require(msg.sender == refereeSigner || msg.sender == owner(), "Only referee can settle payout");
        Battle storage b = battles[roomId];
        require(!b.isSettled, "Battle already settled");
        require(b.player1Staked, "No stakes found in escrow");

        b.isSettled = true;
        b.winner = winner;

        uint256 totalPool = b.player2Staked ? b.stakeAmount * 2 : b.stakeAmount;

        // 💰 Transfer total pot directly to winner's wallet
        if (winner != address(0) && totalPool > 0) {
            (bool sent, ) = winner.call{value: totalPool}("");
            require(sent, "Payout transfer failed");
        }

        // 🎖️ Mint Soulbound NFT if configured
        if (address(reputationNFT) != address(0) && winner != address(0)) {
            try reputationNFT.mintWinnerBadge(winner, tokenUri, problemTitle, winnerScore) {} catch {}
        }

        emit BattleSettled(roomId, winner, totalPool);
    }

    /**
     * @dev Emergency refund if opponent does not join.
     */
    function refund(string memory roomId) external nonReentrant {
        Battle storage b = battles[roomId];
        require(!b.isSettled, "Battle already settled");
        require(msg.sender == b.player1 || msg.sender == b.player2, "Not a participant");
        require(!b.player2Staked, "Cannot refund: match is in progress with both players staked");

        b.isSettled = true;
        uint256 amount = b.stakeAmount;
        b.stakeAmount = 0;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Refund failed");

        emit BattleRefunded(roomId, msg.sender, amount);
    }

    // View helper
    function getBattle(string memory roomId) external view returns (Battle memory) {
        return battles[roomId];
    }
}