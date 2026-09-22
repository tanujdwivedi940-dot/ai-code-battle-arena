// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BattleArena {
    address public owner;
    address public refereeSigner;
    address public reputationNFT;

    struct Battle {
        address player1;
        address player2;
        uint256 stakeAmount;
        bool isSettled;
        address winner;
    }

    mapping(string => Battle) public battles;

    event BattleStaked(string indexed roomId, address indexed player, uint256 amount);
    event BattleSettled(string indexed roomId, address indexed winner, uint256 totalPayout);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _refereeSigner) {
        owner = msg.sender;
        refereeSigner = _refereeSigner;
    }

    function setReputationNFT(address _nft) external onlyOwner {
        reputationNFT = _nft;
    }

    function setRefereeSigner(address _signer) external onlyOwner {
        refereeSigner = _signer;
    }

    /**
     * @dev Player deposits stake into room escrow.
     */
    function stake(string calldata roomId) external payable {
        require(msg.value > 0, "Stake must be > 0");
        Battle storage b = battles[roomId];

        if (b.isSettled || b.player1 == address(0)) {
            b.player1 = msg.sender;
            b.player2 = address(0);
            b.stakeAmount = msg.value;
            b.isSettled = false;
            b.winner = address(0);
        } else if (b.player2 == address(0)) {
            b.player2 = msg.sender;
            b.stakeAmount = msg.value;
        } else {
            b.player1 = msg.sender;
            b.player2 = address(0);
            b.stakeAmount = msg.value;
            b.isSettled = false;
            b.winner = address(0);
        }

        emit BattleStaked(roomId, msg.sender, msg.value);
    }

    /**
     * @dev Winner claims prize pool directly with MetaMask.
     */
    function claimPrize(string calldata roomId) external {
        Battle storage b = battles[roomId];
        require(!b.isSettled, "Already settled");
        require(b.player1 != address(0), "No battle found");

        b.isSettled = true;
        b.winner = msg.sender;

        uint256 payout = b.player2 != address(0) ? b.stakeAmount * 2 : b.stakeAmount;
        if (payout > address(this).balance) {
            payout = address(this).balance;
        }

        if (payout > 0) {
            (bool sent, ) = payable(msg.sender).call{value: payout}("");
            require(sent, "Transfer failed");
        }

        emit BattleSettled(roomId, msg.sender, payout);
    }

    /**
     * @dev Referee automated settlement
     */
    function settleBattle(
        string calldata roomId,
        address payable winner,
        string calldata /* problemTitle */,
        uint256 /* winnerScore */,
        string calldata /* tokenUri */
    ) external {
        require(msg.sender == refereeSigner || msg.sender == owner, "Only referee");
        Battle storage b = battles[roomId];
        require(!b.isSettled, "Already settled");

        b.isSettled = true;
        b.winner = winner;

        uint256 payout = b.player2 != address(0) ? b.stakeAmount * 2 : b.stakeAmount;
        if (payout > address(this).balance) {
            payout = address(this).balance;
        }

        if (winner != address(0) && payout > 0) {
            (bool sent, ) = winner.call{value: payout}("");
            require(sent, "Payout failed");
        }

        emit BattleSettled(roomId, winner, payout);
    }

    function refund(string calldata roomId) external {
        Battle storage b = battles[roomId];
        require(!b.isSettled, "Already settled");
        require(msg.sender == b.player1 || msg.sender == b.player2, "Not participant");

        b.isSettled = true;
        uint256 amount = b.stakeAmount;
        b.stakeAmount = 0;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Refund failed");
    }

    receive() external payable {}
}