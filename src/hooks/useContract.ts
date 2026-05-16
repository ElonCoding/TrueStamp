"use client";

import { useCallback } from "react";
import { Contract, ethers } from "ethers";
import { TRUESTAMP_ABI, CONTRACT_ADDRESS } from "@/contracts/contractConfig";
import { useAccount } from "wagmi";

export type ChainDocument = {
  id: string;
  name: string;
  docType: string;
  cid: string;
  dealId: string;
  metadataURI: string;
  sha256Hash: string;
  txHash: string;
  timestamp: bigint | number;
  isRevoked: boolean;
};

export type VerificationRecord = {
  id: string;
  owner: string;
  issuer: string;
  cid: string;
  dealId: string;
  metadataURI: string;
  sha256Hash: string;
  txHash: string;
  timestamp: number;
  isRevoked: boolean;
  status: "VERIFIED" | "INVALID" | "REVOKED" | "TAMPERED";
  source: "chain" | "demo";
};

export const demoDocuments: ChainDocument[] = [
  {
    id: "DOC-2026-AI-1042",
    name: "B.Tech Computer Science Degree",
    docType: "Academic",
    cid: "bafybeigdyrzt-demo-degree-bridge-1042",
    dealId: "5843921",
    metadataURI: "ipfs://bafybeimetadata-demo-degree-1042",
    sha256Hash: "9f67b7257a8c24b7b3d2b9326f4f2fd761c44ac8e86a6e1a7a53a7e8b9e0fd34",
    txHash: "0x7a32b3f4d74aef0898af4d0d6d325a92d6ce8b52f8b892fb18360a88d3f44b01",
    timestamp: 1767225600,
    isRevoked: false,
  },
  {
    id: "DOC-2026-KYC-2201",
    name: "Identity Verification Certificate",
    docType: "Identity",
    cid: "bafybeiekyc-demo-bridge-2201",
    dealId: "5843998",
    metadataURI: "ipfs://bafybeimetadata-demo-identity-2201",
    sha256Hash: "1c4d7bcfe623a4f93ac5195fb2d29ffca9a4b35fa63c9db0f11b6e97c1e472ad",
    txHash: "0x3b00a86ad4a2d6b26343bf31f1ee5d71eb3c7d5418cc3e8349ca3f8a1ad41965",
    timestamp: 1769817600,
    isRevoked: false,
  },
  {
    id: "DOC-2026-PENDING-809",
    name: "Advanced Solidity Workshop",
    docType: "Professional",
    cid: "bafybeipending-demo-bridge-0809",
    dealId: "pending-filecoin-deal",
    metadataURI: "ipfs://bafybeimetadata-demo-pending-0809",
    sha256Hash: "e0b7c45122fe993f05d83244e9d67a44c52a7a2e8ae16da3f6623f86b9078291",
    txHash: "",
    timestamp: 0,
    isRevoked: false,
  },
];

const requireAddress = () => {
  if (!CONTRACT_ADDRESS) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not configured.");
  }
  return CONTRACT_ADDRESS;
};

export const useContract = () => {
  const { isConnected } = useAccount();

  const getContract = useCallback(async () => {
    if (!isConnected) throw new Error("Connect wallet first.");
    if (typeof window === "undefined" || !window.ethereum) throw new Error("No ethereum provider found");

    const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
    const signer = await provider.getSigner();
    return new Contract(requireAddress(), TRUESTAMP_ABI, signer);
  }, [isConnected]);

  // Fetches the role of the connected user
  const getUserRole = useCallback(async (address: string) => {
    try {
      const contract = await getContract();
      const INSTITUTION_ROLE = await contract.INSTITUTION_ROLE();
      const VERIFIER_ROLE = await contract.VERIFIER_ROLE();

      const isInstitution = await contract.hasRole(INSTITUTION_ROLE, address);
      if (isInstitution) return "issuer";

      const isVerifier = await contract.hasRole(VERIFIER_ROLE, address);
      if (isVerifier) return "verifier";

      return "user";
    } catch (e) {
      console.error("Failed to get role, defaulting to user", e);
      return "user";
    }
  }, [getContract]);

  const issueDoc = useCallback(
    async (recipient: string, cid: string, metadata: string, documentHash: string) => {
      if (!ethers.isAddress(recipient)) {
        throw new Error("Enter a valid recipient wallet address.");
      }
      const contract = await getContract();
      // Using bulkUpload for a single document
      const tx = await contract.bulkUpload([documentHash], [cid], [recipient]);
      const receipt = await tx.wait();
      return receipt?.hash || tx.hash;
    },
    [getContract],
  );

  const verifyDoc = useCallback(
    async (docId: string): Promise<VerificationRecord> => {
      const contract = await getContract();
      // docId is a uint256 now
      const doc = await contract.getDocument(docId);

      const timestamp = Number(doc.timestamp || 0);
      const isRevoked = Number(doc.status) === 1; // Assuming 1 means Revoked in the enum

      return {
        id: docId,
        owner: doc.owner || "",
        issuer: doc.issuer || "",
        cid: doc.cid || "",
        dealId: "",
        metadataURI: "", // metadata is not returned in new ABI
        sha256Hash: doc.fileHash || "",
        txHash: "",
        timestamp,
        isRevoked,
        status: isRevoked ? "REVOKED" : timestamp > 0 ? "VERIFIED" : "INVALID",
        source: "chain",
      };
    },
    [getContract],
  );

  const fetchMyDocs = useCallback(async (address: string): Promise<ChainDocument[]> => {
    const contract = await getContract();
    try {
      const docIds = await contract.getMyDocuments();
      const docs = [];

      for (const id of docIds) {
        const doc = await contract.getDocument(id);
        docs.push({ id, ...doc });
      }

      return docs.map((doc: any, index: number) => ({
        id: doc.id.toString(),
        name: `Document ${doc.id.toString()}`,
        docType: "Standard",
        cid: doc.cid || "",
        issuer: doc.issuer || "",
        dealId: "",
        metadataURI: "",
        sha256Hash: doc.fileHash || "",
        txHash: "",
        timestamp: doc.timestamp || 0,
        isRevoked: Number(doc.status) === 1,
      }));
    } catch (e) {
      console.error("fetchMyDocs failed", e);
      return [];
    }
  }, [getContract]);

  const grantAccess = useCallback(async (docId: string, verifierAddress: string) => {
    const contract = await getContract();
    const tx = await contract.grantAccess(verifierAddress);
    return await tx.wait();
  }, [getContract]);

  const revokeAccess = useCallback(async (docId: string, verifierAddress: string) => {
    const contract = await getContract();
    const tx = await contract.revokeAccess(verifierAddress);
    return await tx.wait();
  }, [getContract]);

  const setNominee = useCallback(async (nomineeAddress: string) => {
    const contract = await getContract();
    const tx = await contract.setNominee(nomineeAddress);
    return await tx.wait();
  }, [getContract]);

  const addInstitution = useCallback(async (institutionAddress: string) => {
    const contract = await getContract();
    const tx = await contract.addInstitution(institutionAddress);
    return await tx.wait();
  }, [getContract]);

  return { getContract, getUserRole, issueDoc, verifyDoc, fetchMyDocs, grantAccess, revokeAccess, setNominee, addInstitution };
};
