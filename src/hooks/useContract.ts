"use client";

import { useCallback } from "react";
import { Contract, ethers } from "ethers";
import { BRIDGE_ABI, CONTRACT_ADDRESS } from "@/contracts/contractConfig";
import { useWallet } from "@/components/walletProvider";

export type ChainDocument = {
  id: string;
  name: string;
  docType: string;
  cid: string;
  txHash: string;
  timestamp: bigint | number;
  isRevoked: boolean;
};

export type VerificationRecord = {
  id: string;
  owner: string;
  cid: string;
  txHash: string;
  timestamp: number;
  isRevoked: boolean;
  status: "VERIFIED" | "INVALID" | "REVOKED";
  source: "chain" | "demo";
};

const requireAddress = () => {
  if (!CONTRACT_ADDRESS) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not configured.");
  }
  return CONTRACT_ADDRESS;
};

export const demoDocuments: ChainDocument[] = [
  {
    id: "DOC-2026-AI-1042",
    name: "B.Tech Computer Science Degree",
    docType: "Academic",
    cid: "bafybeigdyrzt-demo-degree-bridge-1042",
    txHash: "0x7a32b3f4d74aef0898af4d0d6d325a92d6ce8b52f8b892fb18360a88d3f44b01",
    timestamp: 1767225600,
    isRevoked: false,
  },
  {
    id: "DOC-2026-KYC-2201",
    name: "Identity Verification Certificate",
    docType: "Identity",
    cid: "bafybeiekyc-demo-bridge-2201",
    txHash: "0x3b00a86ad4a2d6b26343bf31f1ee5d71eb3c7d5418cc3e8349ca3f8a1ad41965",
    timestamp: 1769817600,
    isRevoked: false,
  },
  {
    id: "DOC-2026-PENDING-809",
    name: "Advanced Solidity Workshop",
    docType: "Professional",
    cid: "bafybeipending-demo-bridge-0809",
    txHash: "",
    timestamp: 0,
    isRevoked: false,
  },
];

export const demoVerification = (id: string): VerificationRecord => {
  const lower = id.toLowerCase();
  const revoked = lower.includes("revoked") || lower.includes("revoke");
  const invalid = lower.includes("invalid") || lower.includes("bad");
  return {
    id,
    owner: invalid ? "0x0000000000000000000000000000000000000000" : "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    cid: invalid ? "" : "bafybeigdyrzt-demo-verified-bridge",
    txHash: invalid
      ? ""
      : "0xf5b2e1c0ba2d97b368d9782a2044a0ac7841bf58a7ed28e20c9c84a77c6f640d",
    timestamp: invalid ? 0 : Math.floor(Date.now() / 1000) - 86400,
    isRevoked: revoked,
    status: invalid ? "INVALID" : revoked ? "REVOKED" : "VERIFIED",
    source: "demo",
  };
};

export const useContract = () => {
  const wallet = useWallet();

  const getContract = useCallback(async () => {
    if (!wallet.isConnected) throw new Error("Connect wallet first.");
    if (!wallet.isCorrectNetwork) throw new Error("Switch to Polygon Amoy.");
    const provider = wallet.getProvider();
    const signer = await provider.getSigner();
    return new Contract(requireAddress(), BRIDGE_ABI, signer);
  }, [wallet]);

  const issueDoc = useCallback(
    async (studentAddr: string, hash: string, cid: string, documentType = "Academic") => {
      if (!ethers.isAddress(studentAddr)) {
        throw new Error("Enter a valid student wallet address.");
      }
      const contract = await getContract();
      const tx = await contract.issueBatch([studentAddr], [hash], [cid], documentType);
      const receipt = await tx.wait();
      return receipt?.hash || tx.hash;
    },
    [getContract],
  );

  const verifyDoc = useCallback(
    async (docId: string): Promise<VerificationRecord> => {
      const contract = await getContract();
      const doc = await contract.documents(docId);
      const timestamp = Number(doc.timestamp || 0);
      const isRevoked = Boolean(doc.isRevoked);
      return {
        id: docId,
        owner: doc.owner || "",
        cid: doc.cid || "",
        txHash: doc.txHash || "",
        timestamp,
        isRevoked,
        status: isRevoked ? "REVOKED" : timestamp > 0 ? "VERIFIED" : "INVALID",
        source: "chain",
      };
    },
    [getContract],
  );

  const fetchMyDocs = useCallback(async (): Promise<ChainDocument[]> => {
    const contract = await getContract();
    const docs = await contract.getMyDocuments();
    return docs.map((doc: ChainDocument, index: number) => ({
      id: doc.id || `DOC-${index + 1}`,
      name: doc.name || `${doc.docType || "Verified"} Document`,
      docType: doc.docType || "Academic",
      cid: doc.cid || "",
      txHash: doc.txHash || "",
      timestamp: doc.timestamp || 0,
      isRevoked: Boolean(doc.isRevoked),
    }));
  }, [getContract]);

  return { getContract, issueDoc, verifyDoc, fetchMyDocs };
};
