"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Clipboard,
  Database,
  ExternalLink,
  FileCheck2,
  FileUp,
  Globe2,
  History,
  LockKeyhole,
  Loader2,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ethers } from "ethers";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { useWallet } from "@/components/walletProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { CONTRACT_ADDRESS, explorerTxUrl, POLYGON_AMOY } from "@/contracts/contractConfig";
import { demoVerification, useContract, VerificationRecord } from "@/hooks/useContract";
import {
  fetchEncryptedPayload,
  generateSha256Hash,
  secureUploadToLighthouse,
  SecureUploadResult,
  verifyEncryptedPayloadHash,
} from "@/lib/secureStorage";
import { cn, copyText, formatDate, shortenAddress } from "@/lib/utils";

type StepState = "idle" | "active" | "complete" | "error";

const documentTypes = ["Academic", "Identity", "Professional", "License", "Award"];
const dashboardTabs: Array<{
  key: "issue" | "verify" | "deals" | "analytics";
  icon: LucideIcon;
  label: string;
}> = [
  { key: "issue", icon: FileUp, label: "Issue New Document" },
  { key: "verify", icon: Search, label: "Verify Document" },
  { key: "deals", icon: Database, label: "Filecoin Deals" },
  { key: "analytics", icon: BarChart3, label: "Storage Analytics" },
];

const statusTone = {
  VERIFIED: "green",
  INVALID: "red",
  REVOKED: "orange",
  TAMPERED: "red",
} as const;

const stepLabel = {
  encrypt: "Encrypting File...",
  upload: "Uploading to Lighthouse...",
  deal: "Creating Filecoin Deal...",
  chain: "Confirming on Polygon Amoy...",
};

const AnalyticsCard = ({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
}) => (
  <Card className="p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{label}</p>
        <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={cn("rounded-2xl p-3", tone)}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </Card>
);

const Stepper = ({ steps }: { steps: Record<keyof typeof stepLabel, StepState> }) => (
  <div className="grid gap-3 md:grid-cols-3">
    {(Object.keys(stepLabel) as Array<keyof typeof stepLabel>).map((key) => {
      const state = steps[key];
      return (
        <div
          key={key}
          className={cn(
            "flex items-center gap-3 rounded-xl border p-3 text-sm",
            state === "complete" && "border-green-400/30 bg-green-400/10 text-green-200",
            state === "active" && "border-electric-blue/30 bg-electric-blue/10 text-electric-blue",
            state === "error" && "border-red-400/30 bg-red-400/10 text-red-200",
            state === "idle" && "border-white/10 bg-white/[0.04] text-gray-400",
          )}
        >
          {state === "active" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state === "complete" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : state === "error" ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-current opacity-50" />
          )}
          {stepLabel[key]}
        </div>
      );
    })}
  </div>
);

export default function OrganiserDashboard() {
  const wallet = useWallet();
  const { issueSecureDocument, verifyDoc } = useContract();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"issue" | "verify" | "deals" | "analytics">("issue");
  const [studentAddr, setStudentAddr] = useState("");
  const [docHash, setDocHash] = useState("");
  const [cid, setCid] = useState("");
  const [dealId, setDealId] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [documentType, setDocumentType] = useState("Academic");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [secureUpload, setSecureUpload] = useState<SecureUploadResult | null>(null);
  const [storageStatus, setStorageStatus] = useState("Ready for encrypted upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [steps, setSteps] = useState<Record<keyof typeof stepLabel, StepState>>({
    encrypt: "idle",
    upload: "idle",
    deal: "idle",
    chain: "idle",
  });
  const [txHash, setTxHash] = useState("");
  const [docId, setDocId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationKey, setVerificationKey] = useState("");
  const [integrityHash, setIntegrityHash] = useState("");
  const [result, setResult] = useState<VerificationRecord | null>(null);
  const [history, setHistory] = useState<VerificationRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("the_bridge_verification_history");
    if (saved) {
      window.setTimeout(() => setHistory(JSON.parse(saved)), 0);
    }
  }, []);

  const saveHistory = (record: VerificationRecord) => {
    const next = [record, ...history.filter((item) => item.id !== record.id)].slice(0, 6);
    setHistory(next);
    localStorage.setItem("the_bridge_verification_history", JSON.stringify(next));
  };

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setTxHash("");
    setUploadProgress(0);
    setSecureUpload(null);
    setCid("");
    setDealId("");
    setMetadataURI("");
    try {
      const hash = await generateSha256Hash(file);
      setDocHash(hash);
      toast({ tone: "success", title: "SHA256 hash generated", description: hash });
    } catch {
      toast({ tone: "error", title: "Could not hash file" });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ tone: "error", title: "Choose a document first" });
      return;
    }
    if (!secretKey.trim()) {
      toast({ tone: "error", title: "Encryption key required" });
      return;
    }
    setSteps({ encrypt: "active", upload: "idle", deal: "idle", chain: "idle" });
    try {
      const result = await secureUploadToLighthouse({
        file: selectedFile,
        owner: studentAddr || wallet.address || "demo-owner",
        secretKey,
        onProgress: setUploadProgress,
        onStatus: (status) => {
          setStorageStatus(
            status === "hashing"
              ? "Generating SHA256 hash..."
              : status === "encrypting"
                ? "Encrypting File..."
                : status === "uploading"
                  ? "Uploading encrypted blob to Lighthouse..."
                  : status === "cid"
                    ? "Generating CID..."
                    : status === "deal"
                      ? "Creating Filecoin Deal..."
                      : "Encrypted file stored on IPFS/Filecoin",
          );
          setSteps((current) => ({
            ...current,
            encrypt: status === "hashing" || status === "encrypting" ? "active" : "complete",
            upload: status === "uploading" ? "active" : ["cid", "deal", "complete"].includes(status) ? "complete" : current.upload,
            deal: status === "deal" ? "active" : status === "complete" ? "complete" : current.deal,
          }));
        },
      });
      setSecureUpload(result);
      setDocHash(result.sha256Hash);
      setCid(result.cid);
      setDealId(result.dealId);
      setMetadataURI(result.metadataURI);
      toast({ tone: "success", title: "Encrypted Lighthouse upload complete", description: result.cid });
    } catch (error) {
      setSteps((current) => ({ ...current, encrypt: "error", upload: "error", deal: "error" }));
      toast({
        tone: "error",
        title: "Secure upload failed",
        description: error instanceof Error ? error.message : "Try again with a smaller file.",
      });
    }
  };

  const handleIssue = async () => {
    if (!wallet.isConnected) {
      toast({ tone: "error", title: "Connect wallet before issuing" });
      return;
    }
    if (!wallet.isCorrectNetwork) {
      toast({ tone: "error", title: "Wrong network", description: "Switch to Polygon Amoy." });
      return;
    }
    if (!CONTRACT_ADDRESS) {
      toast({
        tone: "error",
        title: "Contract address missing",
        description: "Set NEXT_PUBLIC_CONTRACT_ADDRESS to enable live issuance.",
      });
      return;
    }
    if (!ethers.isAddress(studentAddr)) {
      toast({ tone: "error", title: "Invalid student wallet address" });
      return;
    }
    if (!docHash || !cid || !dealId || !metadataURI) {
      toast({ tone: "error", title: "Hash, CID, Deal ID, and metadata URI are required" });
      return;
    }

    setSteps({ encrypt: "complete", upload: "complete", deal: "complete", chain: "active" });
    try {
      const hash = await issueSecureDocument({
        owner: studentAddr,
        sha256Hash: docHash,
        cid,
        dealId,
        metadataURI,
        metadataJson: JSON.stringify({
          owner: studentAddr,
          sha256Hash: docHash,
          cid,
          dealId,
          metadataURI,
          documentType,
          fileName: secureUpload?.fileName || selectedFile?.name || "encrypted-document",
          timestamp: new Date().toISOString(),
        }),
      });
      setTxHash(hash);
      setSteps({ encrypt: "complete", upload: "complete", deal: "complete", chain: "complete" });
      toast({ tone: "success", title: "Encrypted document metadata stored on-chain", description: hash });
    } catch (error) {
      setSteps((current) => ({ ...current, chain: "error" }));
      toast({
        tone: "error",
        title: "Issuance failed",
        description: error instanceof Error ? error.message : "Contract call failed.",
      });
    }
  };

  const handleVerify = async () => {
    const cleanId = docId.trim();
    if (!cleanId) return;
    setVerifying(true);
    try {
      const record =
        wallet.isConnected && wallet.isCorrectNetwork && CONTRACT_ADDRESS
          ? await verifyDoc(cleanId)
          : demoVerification(cleanId);
      if (verificationKey && record.cid && record.sha256Hash) {
        try {
          const encryptedPayload = await fetchEncryptedPayload(record.cid);
          const integrity = verifyEncryptedPayloadHash(
            encryptedPayload,
            verificationKey,
            record.sha256Hash,
          );
          setIntegrityHash(integrity.regeneratedHash);
          record.status = integrity.matches ? "VERIFIED" : "TAMPERED";
        } catch {
          setIntegrityHash("");
          toast({
            tone: "info",
            title: "On-chain verification shown",
            description: "Encrypted payload could not be fetched or decrypted in this environment.",
          });
        }
      }
      setResult(record);
      saveHistory(record);
      toast({ tone: "success", title: `${record.status} result ready` });
    } catch {
      const record = demoVerification(cleanId);
      setResult(record);
      saveHistory(record);
      toast({ tone: "info", title: "Showing demo verification fallback" });
    } finally {
      setVerifying(false);
    }
  };

  const analytics = useMemo(
    () => [
      { label: "Issued docs", value: "1,284", icon: FileCheck2, tone: "bg-electric-blue/12 text-electric-blue" },
      { label: "Verified today", value: "328", icon: ShieldCheck, tone: "bg-green-400/12 text-green-300" },
      { label: "Avg finality", value: "2.1s", icon: Sparkles, tone: "bg-neon-purple/12 text-purple-200" },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_20%_10%,rgba(0,240,255,0.16),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(176,38,255,0.16),transparent_32%),linear-gradient(180deg,#050816,#070a18)]" />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-2xl lg:min-h-[calc(100vh-2.5rem)]">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-electric-blue to-neon-purple p-3">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold">The Bridge</p>
              <p className="text-xs text-gray-500">Organiser Console</p>
            </div>
          </div>
          <nav className="space-y-2">
            {dashboardTabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition",
                  activeTab === key
                    ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-gray-400 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-electric-blue/20 bg-electric-blue/10 p-4">
            <Badge tone={wallet.isCorrectNetwork ? "green" : "orange"}>
              {wallet.isCorrectNetwork ? "Polygon Amoy Live" : "Network check"}
            </Badge>
            <p className="mt-3 text-sm text-gray-300">
              Chain ID {POLYGON_AMOY.chainId}. Demo records stay available when the contract is not configured.
            </p>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
            <div>
              <Badge tone="cyan">Polygon Amoy Testnet</Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                Organiser Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                Encrypt documents locally, store encrypted blobs on Lighthouse/Filecoin, and anchor verifiable metadata on Polygon Amoy.
              </p>
            </div>
            <ConnectWalletButton />
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {analytics.map((item) => (
              <AnalyticsCard key={item.label} {...item} />
            ))}
          </div>

          {activeTab === "issue" ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5 md:p-6">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Issue New Document</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Hash with SHA256, encrypt with AES, upload encrypted data to Lighthouse, then store CID and Filecoin deal metadata on-chain.
                    </p>
                  </div>
                  <Badge tone="purple">Smart contract write</Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <label
                    onDrop={(event) => {
                      event.preventDefault();
                      const file = event.dataTransfer.files?.[0];
                      if (file) void handleFile(file);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    className="flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-electric-blue/30 bg-black/24 p-8 text-center transition hover:border-electric-blue/60 hover:bg-electric-blue/8"
                  >
                    <UploadCloud className="h-14 w-14 text-electric-blue" />
                    <p className="mt-5 text-lg font-semibold text-white">
                      {selectedFile ? selectedFile.name : "Drag & drop certificate file"}
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                      Drop a PDF, image, or JSON proof. Raw files never leave the browser; only the AES encrypted blob is uploaded.
                    </p>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleFile(file);
                      }}
                    />
                    {uploadProgress > 0 && <Progress value={uploadProgress} className="mt-6 w-full max-w-sm" />}
                  </label>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Owner Wallet Address
                      </label>
                      <Input
                        value={studentAddr}
                        onChange={(event) => setStudentAddr(event.target.value)}
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        AES Secret Key
                      </label>
                      <Input
                        value={secretKey}
                        onChange={(event) => setSecretKey(event.target.value)}
                        placeholder="Local encryption passphrase"
                        type="password"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        SHA256 Hash
                      </label>
                      <Input value={docHash} onChange={(event) => setDocHash(event.target.value)} placeholder="0x..." />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        IPFS CID
                      </label>
                      <div className="flex gap-2">
                        <Input value={cid} onChange={(event) => setCid(event.target.value)} placeholder="bafy..." />
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => void copyText(cid)}
                          aria-label="Copy CID"
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                          Filecoin Deal ID
                        </label>
                        <Input value={dealId} onChange={(event) => setDealId(event.target.value)} placeholder="pending..." />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                          Metadata URI
                        </label>
                        <Input value={metadataURI} onChange={(event) => setMetadataURI(event.target.value)} placeholder="ipfs://..." />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Document Type
                      </label>
                      <select
                        value={documentType}
                        onChange={(event) => setDocumentType(event.target.value)}
                        className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-electric-blue"
                      >
                        {documentTypes.map((type) => (
                          <option key={type} value={type} className="bg-[#070a18]">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button type="button" variant="secondary" onClick={handleUpload} className="flex-1">
                        <UploadCloud className="h-4 w-4" />
                        Encrypt & Upload
                      </Button>
                      <Button type="button" onClick={handleIssue} className="flex-1">
                        <FileCheck2 className="h-4 w-4" />
                        Issue Document
                      </Button>
                    </div>
                    <Stepper steps={steps} />
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Badge tone={secureUpload ? "green" : "neutral"}>
                        <LockKeyhole className="h-3.5 w-3.5" />
                        ENCRYPTED
                      </Badge>
                      <Badge tone={cid ? "green" : "neutral"}>
                        <Globe2 className="h-3.5 w-3.5" />
                        STORED ON FILECOIN
                      </Badge>
                      <Badge tone={docHash ? "cyan" : "neutral"}>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        SHA256 PROOF
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{storageStatus}</p>
                    {txHash && (
                      <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
                        <p className="text-sm font-semibold text-green-200">Document Issued Successfully</p>
                        <a
                          href={explorerTxUrl(txHash)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 break-all text-sm text-electric-blue"
                        >
                          {txHash}
                          <ExternalLink className="h-4 w-4 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : activeTab === "verify" ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <Card className="p-5 md:p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">Verify Document</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Search by document ID or scan a QR proof from a certificate.
                    </p>
                  </div>
                  <Badge tone="cyan">Read contract</Badge>
                </div>
                <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                  <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/24 p-6 text-center">
                    <QrCode className="h-24 w-24 text-gray-500" />
                    <p className="mt-4 text-sm font-semibold text-white">QR scanner placeholder</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Camera scanning can be added later without changing verification logic.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={docId}
                        onChange={(event) => setDocId(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") void handleVerify();
                        }}
                        placeholder="Document ID, e.g. DOC-2026-AI-1042"
                      />
                      <Button type="button" onClick={handleVerify} disabled={verifying}>
                        {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Verify
                      </Button>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Decryption Key for Payload Integrity
                      </label>
                      <Input
                        value={verificationKey}
                        onChange={(event) => setVerificationKey(event.target.value)}
                        placeholder="Optional AES key to fetch, decrypt, and compare hash"
                        type="password"
                      />
                    </div>

                    {result && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                          "rounded-2xl border p-5",
                          result.status === "VERIFIED" && "border-green-400/25 bg-green-400/10",
                          result.status === "INVALID" && "border-red-400/25 bg-red-400/10",
                          result.status === "REVOKED" && "border-orange-400/25 bg-orange-400/10",
                        )}
                      >
                        <Badge tone={statusTone[result.status]}>
                          {result.status === "VERIFIED" && "VERIFIED"}
                          {result.status === "INVALID" && "INVALID"}
                          {result.status === "REVOKED" && "REVOKED"}
                          {result.status === "TAMPERED" && "TAMPERED"}
                        </Badge>
                        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                          <InfoRow label="Owner" value={shortenAddress(result.owner)} />
                          <InfoRow label="Timestamp" value={formatDate(result.timestamp)} />
                          <InfoRow label="CID" value={result.cid || "Not found"} copyValue={result.cid} />
                          <InfoRow label="Deal ID" value={result.dealId || "Pending"} copyValue={result.dealId} />
                          <InfoRow label="SHA256" value={shortenAddress(result.sha256Hash, 12, 8)} copyValue={result.sha256Hash} />
                          <InfoRow label="Metadata" value={result.metadataURI || "Not found"} copyValue={result.metadataURI} />
                          <InfoRow label="Blockchain status" value={result.source === "chain" ? "Polygon Amoy" : "Demo fallback"} />
                        </div>
                        {integrityHash && (
                          <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-gray-300">
                            Regenerated local hash: <span className="text-electric-blue">{shortenAddress(integrityHash, 14, 10)}</span>
                          </p>
                        )}
                        {result.txHash && (
                          <a
                            href={explorerTxUrl(result.txHash)}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 break-all text-sm text-electric-blue"
                          >
                            {shortenAddress(result.txHash, 10, 8)}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-electric-blue" />
                  <h3 className="font-bold">Recent verifications</h3>
                </div>
                <div className="space-y-3">
                  {(history.length ? history : [demoVerification("DOC-2026-AI-1042"), demoVerification("revoked-demo")]).map((item) => (
                    <button
                      key={`${item.id}-${item.status}`}
                      onClick={() => {
                        setDocId(item.id);
                        setResult(item);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/24 p-3 text-left transition hover:bg-white/8"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-white">{item.id}</span>
                        <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          ) : activeTab === "deals" ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 md:grid-cols-2">
              {(history.length ? history : [demoVerification("DOC-2026-AI-1042"), demoVerification("DOC-2026-KYC-2201")]).map((item) => (
                <Card key={item.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge tone="green">
                        <Globe2 className="h-3.5 w-3.5" />
                        STORED ON FILECOIN
                      </Badge>
                      <h2 className="mt-4 text-xl font-bold text-white">{item.id}</h2>
                      <p className="mt-1 text-sm text-gray-500">Encrypted Lighthouse CID with Filecoin replication tracking.</p>
                    </div>
                    <Database className="h-8 w-8 text-electric-blue" />
                  </div>
                  <div className="mt-5 grid gap-3 text-sm">
                    <InfoRow label="CID" value={item.cid || "Pending"} copyValue={item.cid} />
                    <InfoRow label="Deal ID" value={item.dealId || "Pending"} copyValue={item.dealId} />
                    <InfoRow label="Replication" value={item.dealId ? "Active storage deal" : "Awaiting deal"} />
                    <InfoRow label="Metadata" value={item.metadataURI || "Pending"} copyValue={item.metadataURI} />
                  </div>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {([
                ["Encrypted uploads", "100%", LockKeyhole, "Every document is AES encrypted before IPFS upload."],
                ["Filecoin deals", "2,418", Globe2, "Permanent decentralized storage proofs tracked by deal ID."],
                ["Integrity checks", "99.9%", ShieldCheck, "SHA256 proofs detect tampered payloads before trust is granted."],
                ["Metadata anchors", "1,284", Database, "CID, deal ID, owner, timestamp, and metadata URI stored on-chain."],
              ] as Array<[string, string, LucideIcon, string]>).map(([label, value, Icon, text]) => (
                <Card key={label as string} className="p-5">
                  <div className="rounded-2xl bg-white/8 p-3 text-electric-blue w-fit">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-3xl font-bold text-white">{value as string}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-200">{label as string}</p>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{text as string}</p>
                </Card>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}

const InfoRow = ({
  label,
  value,
  copyValue,
}: {
  label: string;
  value: string;
  copyValue?: string;
}) => (
  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
    <p className="text-xs uppercase tracking-[0.16em] text-gray-500">{label}</p>
    <div className="mt-2 flex items-center gap-2">
      <p className="min-w-0 flex-1 truncate text-white">{value}</p>
      {copyValue && (
        <button onClick={() => void copyText(copyValue)} className="text-gray-500 hover:text-white" aria-label={`Copy ${label}`}>
          <Clipboard className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);
