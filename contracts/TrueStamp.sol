// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract TrueStamp is AccessControl {
    bytes32 public constant INSTITUTION_ROLE = keccak256("INSTITUTION_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Document {
        address owner;
        address issuer;
        string cid;
        string metadata; // metadata URI or JSON
        string documentHash; // permanent proof anchor
        uint256 timestamp;
        bool isRevoked;
    }

    // Mapping from document ID to Document
    mapping(bytes32 => Document) public documents;
    
    // Mapping from owner to their document IDs
    mapping(address => bytes32[]) public userDocuments;

    // Nominee mapping (owner -> nominee)
    mapping(address => address) public nominees;

    // Privacy control (document ID -> (verifier address -> bool))
    mapping(bytes32 => mapping(address => bool)) public documentAccess;

    // Events
    event DocumentUploaded(bytes32 indexed docId, address indexed owner, address indexed issuer, string cid, string documentHash);
    event DocumentRevoked(bytes32 indexed docId);
    event AccessGranted(bytes32 indexed docId, address indexed verifier);
    event AccessRevoked(bytes32 indexed docId, address indexed verifier);
    event NomineeUpdated(address indexed owner, address indexed nominee);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Issues a new document. Only INSTITUTION_ROLE can call this.
     */
    function issueDocument(
        address recipient,
        string memory cid,
        string memory metadata,
        string memory documentHash
    ) external onlyRole(INSTITUTION_ROLE) returns (bytes32) {
        bytes32 docId = keccak256(abi.encodePacked(recipient, msg.sender, cid, documentHash, block.timestamp));
        
        documents[docId] = Document({
            owner: recipient,
            issuer: msg.sender,
            cid: cid,
            metadata: metadata,
            documentHash: documentHash,
            timestamp: block.timestamp,
            isRevoked: false
        });

        userDocuments[recipient].push(docId);

        emit DocumentUploaded(docId, recipient, msg.sender, cid, documentHash);
        return docId;
    }

    /**
     * @dev Revoke a document. Only the issuer can revoke it.
     */
    function revokeDocument(bytes32 docId) external {
        require(documents[docId].issuer == msg.sender, "Not the issuer");
        require(!documents[docId].isRevoked, "Already revoked");
        
        documents[docId].isRevoked = true;
        emit DocumentRevoked(docId);
    }

    /**
     * @dev Grant access to a verifier for a specific document. Only the document owner can do this.
     */
    function grantAccess(bytes32 docId, address verifier) external {
        require(documents[docId].owner == msg.sender, "Not the document owner");
        documentAccess[docId][verifier] = true;
        emit AccessGranted(docId, verifier);
    }

    /**
     * @dev Revoke access from a verifier. Only the document owner can do this.
     */
    function revokeAccess(bytes32 docId, address verifier) external {
        require(documents[docId].owner == msg.sender, "Not the document owner");
        documentAccess[docId][verifier] = false;
        emit AccessRevoked(docId, verifier);
    }

    /**
     * @dev Check if a verifier has access to a document.
     */
    function hasAccess(bytes32 docId, address verifier) public view returns (bool) {
        return documentAccess[docId][verifier] || documents[docId].owner == verifier || documents[docId].issuer == verifier;
    }

    /**
     * @dev Set a nominee for account recovery.
     */
    function setNominee(address nominee) external {
        nominees[msg.sender] = nominee;
        emit NomineeUpdated(msg.sender, nominee);
    }

    /**
     * @dev Get current nominee.
     */
    function getNominee(address owner) external view returns (address) {
        return nominees[owner];
    }

    /**
     * @dev Allow a nominee to claim ownership of documents (Recovery).
     */
    function recoverAccount(address oldOwner) external {
        require(nominees[oldOwner] == msg.sender, "Not the authorized nominee");
        
        bytes32[] memory docs = userDocuments[oldOwner];
        for (uint i = 0; i < docs.length; i++) {
            documents[docs[i]].owner = msg.sender;
            userDocuments[msg.sender].push(docs[i]);
        }
        
        delete userDocuments[oldOwner];
        nominees[oldOwner] = address(0);
    }

    /**
     * @dev Fetch all documents for a specific user.
     */
    function getUserDocuments(address user) external view returns (Document[] memory) {
        bytes32[] memory docIds = userDocuments[user];
        Document[] memory docs = new Document[](docIds.length);
        
        for (uint i = 0; i < docIds.length; i++) {
            docs[i] = documents[docIds[i]];
        }
        
        return docs;
    }

    /**
     * @dev Verify a document's details. Can be used by anyone, but returns full details if access is granted.
     */
    function verifyDocument(bytes32 docId) external view returns (
        address owner,
        address issuer,
        string memory cid,
        string memory metadata,
        string memory documentHash,
        uint256 timestamp,
        bool isRevoked,
        bool accessGranted
    ) {
        Document memory doc = documents[docId];
        bool canView = hasAccess(docId, msg.sender);
        
        if (canView) {
            return (doc.owner, doc.issuer, doc.cid, doc.metadata, doc.documentHash, doc.timestamp, doc.isRevoked, true);
        } else {
            // Return minimal info if no access
            return (address(0), doc.issuer, "", "", "", doc.timestamp, doc.isRevoked, false);
        }
    }
}
