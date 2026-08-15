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
 * @dev Manages 1v1 staking, escrows testnet POL/MATIC, and pays out the AI-verified winner.
 */
contract BattleArena is Ownable, ReentrancyGuard {
    IReputationNFT public reputationNFT;

    // Backend oracle wallet authorized to verify AI judge results
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
     * @dev Players stake testnet POL into the battle room escrow.
     */
    function stake(string memory roomId) external payable nonReentrant {
        require(msg.value > 0, "Stake amount must be greater than 0");
        Battle storage b = battles[roomId];

        if (b.player1 == address(0)) {
            b.roomId = roomId;
            b.player1 = msg.sender;
            b.stakeAmount = msg.value;
            b.player1Staked = true;
        } else if (b.player2 == address(0)) {
            require(msg.sender != b.player1, "Cannot play against yourself");
            require(msg.value == b.stakeAmount, "Stake amount must match Player 1");
            b.player2 = msg.sender;
            b.player2Staked = true;
        } else {
            revert("Battle room is already full");
        }

        emit BattleStaked(roomId, msg.sender, msg.value);
    }

    /**
     * @dev Backend referee wallet or contract owner releases the pot to the AI-verified winner.
     */
    function settleBattle(
        string memory roomId,
        address payable winner,
        string memory problemTitle,
        uint256 winnerScore,
        string memory tokenUri
    ) external nonReentrant {
        require(msg.sender == refereeSigner || msg.sender == owner(), "Only referee can settle battle");
        Battle storage b = battles[roomId];
        require(!b.isSettled, "Battle already settled");
        require(b.player1Staked, "No stakes deposited");

        b.isSettled = true;
        b.winner = winner;

        uint256 totalPool = b.player2Staked ? b.stakeAmount * 2 : b.stakeAmount;

        // Payout winner
        (bool sent, ) = winner.call{value: totalPool}("");
        require(sent, "Payout transfer failed");

        // Mint Soulbound Badge if NFT contract is configured
        if (address(reputationNFT) != address(0)) {
            reputationNFT.mintWinnerBadge(winner, tokenUri, problemTitle, winnerScore);
        }

        emit BattleSettled(roomId, winner, totalPool);
    }

    /**
     * @dev Emergency refund in case the opponent disconnects or battle is cancelled.
     */
    function refund(string memory roomId) external nonReentrant {
        Battle storage b = battles[roomId];
        require(!b.isSettled, "Battle already settled");
        require(msg.sender == b.player1 || msg.sender == b.player2, "Not a participant");
        require(!b.player2Staked, "Match in progress: both players staked");

        b.isSettled = true;
        uint256 amount = b.stakeAmount;
        b.stakeAmount = 0;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Refund failed");
    }
}