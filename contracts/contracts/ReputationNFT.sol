// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationNFT
 * @dev Soulbound (Non-transferable) ERC-721 token rewarded to winners of AI Code Battles.
 */
contract ReputationNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Address of the BattleArena contract authorized to mint
    address public battleArenaContract;

    struct BadgeData {
        uint256 battleId;
        string problemTitle;
        uint256 score;
        uint256 timestamp;
    }

    mapping(uint256 => BadgeData) public badgeDetails;
    mapping(address => uint256) public userWinCount;

    event BadgeMinted(address indexed recipient, uint256 indexed tokenId, string problemTitle, uint256 score);

    modifier onlyAuthorized() {
        require(msg.sender == owner() || msg.sender == battleArenaContract, "Not authorized to mint");
        _;
    }

    constructor() ERC721("AI Code Battle Reputation", "ACBR") Ownable(msg.sender) {}

    function setBattleArenaContract(address _arena) external onlyOwner {
        battleArenaContract = _arena;
    }

    /**
     * @dev Mints a non-transferable Soulbound reputation badge to the match winner.
     */
    function mintWinnerBadge(
        address recipient,
        string memory tokenUri,
        string memory problemTitle,
        uint256 score
    ) external onlyAuthorized returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenUri);

        badgeDetails[tokenId] = BadgeData({
            battleId: tokenId,
            problemTitle: problemTitle,
            score: score,
            timestamp: block.timestamp
        });

        userWinCount[recipient] += 1;

        emit BadgeMinted(recipient, tokenId, problemTitle, score);
        return tokenId;
    }

    /**
     * @dev Overriding transfer hooks in OpenZeppelin v5 to make the NFT Soulbound (Non-transferable).
     * Tokens can only be minted (from address 0) or burned (to address 0).
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Reputation badges cannot be transferred");
        }
        return super._update(to, tokenId, auth);
    }
}