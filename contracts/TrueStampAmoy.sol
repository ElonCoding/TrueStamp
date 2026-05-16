// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title TrueStampAmoy
/// @notice Minimal Polygon Amoy contract matching the frontend functions currently used by the MVP.
contract TrueStampAmoy is AccessControl {
    bytes32 public constant INSTITUTION_ROLE = keccak256("INSTITUTION_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Document {
        bytes32 id;
        address owner;
        address issuer;
        string cid;
        string metadata;
        uint256 timestamp;
        bool isRevoked;
    }

    uint256 public documentCount;

    mapping(bytes32 => Document) private documents;
    mapping(address => bytes32[]) private userDocumentIds;
    mapping(bytes32 => mapping(address => bool)) private documentAccess;
    mapping(address => address) private nominees;

    event DocumentIssued(
        bytes32 indexed docId,
        address indexed owner,
        address indexed issuer,
        string cid,
        string metadata,
        uint256 timestamp
    );
    event DocumentRevoked(bytes32 indexed docId, address indexed issuer);
    event AccessGranted(bytes32 indexed docId, address indexed verifier);
    event AccessRevoked(bytes32 indexed docId, address indexed verifier);
    event NomineeUpdated(address indexed owner, address indexed nominee);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(INSTITUTION_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    function addInstitution(address institution) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(institution != address(0), "Invalid institution");
        _grantRole(INSTITUTION_ROLE, institution);
    }

    function addVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(verifier != address(0), "Invalid verifier");
        _grantRole(VERIFIER_ROLE, verifier);
    }

    function issueDocument(
        address recipient,
        string calldata cid,
        string calldata metadata
    ) external onlyRole(INSTITUTION_ROLE) returns (bytes32 docId) {
        require(recipient != address(0), "Invalid recipient");
        require(bytes(cid).length > 0, "CID required");

        docId = keccak256(
            abi.encodePacked(
                recipient,
                msg.sender,
                cid,
                metadata,
                block.chainid,
                block.timestamp,
                documentCount
            )
        );

        documents[docId] = Document({
            id: docId,
            owner: recipient,
            issuer: msg.sender,
            cid: cid,
            metadata: metadata,
            timestamp: block.timestamp,
            isRevoked: false
        });

        userDocumentIds[recipient].push(docId);
        documentCount += 1;

        emit DocumentIssued(docId, recipient, msg.sender, cid, metadata, block.timestamp);
    }

    function verifyDocument(bytes32 docId)
        external
        view
        returns (
            address owner,
            address issuer,
            string memory cid,
            string memory metadata,
            uint256 timestamp,
            bool isRevoked
        )
    {
        Document memory doc = documents[docId];
        return (doc.owner, doc.issuer, doc.cid, doc.metadata, doc.timestamp, doc.isRevoked);
    }

    function getUserDocuments(address user) public view returns (Document[] memory result) {
        bytes32[] memory ids = userDocumentIds[user];
        result = new Document[](ids.length);

        for (uint256 i = 0; i < ids.length; i += 1) {
            result[i] = documents[ids[i]];
        }
    }

    function getMyDocuments() external view returns (Document[] memory) {
        return getUserDocuments(msg.sender);
    }

    function revokeDocument(bytes32 docId) external {
        Document storage doc = documents[docId];
        require(doc.owner != address(0), "Document not found");
        require(doc.issuer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");
        require(!doc.isRevoked, "Already revoked");

        doc.isRevoked = true;
        emit DocumentRevoked(docId, msg.sender);
    }

    function grantAccess(bytes32 docId, address verifier) external {
        require(documents[docId].owner == msg.sender, "Not document owner");
        require(verifier != address(0), "Invalid verifier");

        documentAccess[docId][verifier] = true;
        emit AccessGranted(docId, verifier);
    }

    function revokeAccess(bytes32 docId, address verifier) external {
        require(documents[docId].owner == msg.sender, "Not document owner");

        documentAccess[docId][verifier] = false;
        emit AccessRevoked(docId, verifier);
    }

    function hasVerifierAccess(bytes32 docId, address verifier) external view returns (bool) {
        Document memory doc = documents[docId];

        return documentAccess[docId][verifier]
            || doc.owner == verifier
            || doc.issuer == verifier
            || hasRole(DEFAULT_ADMIN_ROLE, verifier);
    }

    function setNominee(address nominee) external {
        require(nominee != msg.sender, "Cannot nominate self");

        nominees[msg.sender] = nominee;
        emit NomineeUpdated(msg.sender, nominee);
    }

    function getNominee(address owner) external view returns (address) {
        return nominees[owner];
    }

    function documentExists(bytes32 docId) external view returns (bool) {
        return documents[docId].owner != address(0);
    }
}
