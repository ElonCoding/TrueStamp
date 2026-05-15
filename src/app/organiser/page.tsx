"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileUp, Search, UploadCloud, FileCheck2,
  ShieldCheck, Loader2, Globe2, ExternalLink,
  CheckCircle2, XCircle, Database, Hash
} from "lucide-react";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { useWallet } from "@/components/walletProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { generateSha256Hash } from "@/lib/secureStorage";
import { uploadToIPFS, saveToPolygon, verifyDocumentOnPolygon } from "@/blockchain/LighthouseService";
import { explorerTxUrl } from "@/contracts/contractConfig";
import { cn, copyText, formatDate, shortenAddress } from "@/lib/utils";

type StepState = "idle" | "active" | "complete" | "error";

export default function OrganiserDashboard() {
  const wallet = useWallet();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"issue" | "verify">("issue");

  // Issue State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docHash, setDocHash] = useState("");
  const [cid, setCid] = useState("");
  const [txHash, setTxHash] = useState("");
  const [issueSteps, setIssueSteps] = useState<{ hash: StepState, upload: StepState, chain: StepState }>({
    hash: "idle", upload: "idle", chain: "idle"
  });

  // Verify State
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setTxHash("");
    setCid("");
    setIssueSteps({ hash: "active", upload: "idle", chain: "idle" });

    try {
      const hash = await generateSha256Hash(file);
      setDocHash("0x" + hash); // prepending 0x if it's a hex string (usually preferred for smart contracts)
      setIssueSteps(prev => ({ ...prev, hash: "complete" }));
      toast({ tone: "success", title: "File Hashed Successfully" });
    } catch {
      setIssueSteps(prev => ({ ...prev, hash: "error" }));
      toast({ tone: "error", title: "Could not hash file" });
    }
  };

  const handleIssue = async () => {
    if (!wallet.isConnected) return toast({ tone: "error", title: "Connect wallet before issuing" });
    if (!selectedFile) return toast({ tone: "error", title: "Please select a file to upload" });
    if (!docHash) return toast({ tone: "error", title: "File hash is missing" });

    try {
      // Upload to IPFS via Lighthouse
      setIssueSteps(prev => ({ ...prev, upload: "active" }));
      const uploadedCid = await uploadToIPFS(selectedFile);
      setCid(uploadedCid);
      setIssueSteps(prev => ({ ...prev, upload: "complete" }));
      toast({ tone: "success", title: "Uploaded to Lighthouse", description: uploadedCid });

      // Save to Polygon
      setIssueSteps(prev => ({ ...prev, chain: "active" }));
      const transactionHash = await saveToPolygon(docHash, uploadedCid);
      setTxHash(transactionHash);
      setIssueSteps(prev => ({ ...prev, chain: "complete" }));
      toast({ tone: "success", title: "Issued on Polygon", description: transactionHash });

    } catch (error: any) {
      if (issueSteps.upload === "active") setIssueSteps(prev => ({ ...prev, upload: "error" }));
      if (issueSteps.chain === "active") setIssueSteps(prev => ({ ...prev, chain: "error" }));
      toast({ tone: "error", title: "Issuance failed", description: error.message || "An error occurred." });
    }
  };

  const handleVerifyFile = async (file: File) => {
    setVerifyFile(file);
    setVerifyHash("");
    setVerifyResult(null);
    setVerifying(true);

    try {
      const hash = await generateSha256Hash(file);
      const formattedHash = "0x" + hash;
      setVerifyHash(formattedHash);

      const result = await verifyDocumentOnPolygon(formattedHash);
      if (result.success) {
        setVerifyResult(result);
        toast({ tone: "success", title: "Document Verified!" });
      } else {
        setVerifyResult({ status: "NOT_FOUND" });
        toast({ tone: "error", title: "Document not found on chain" });
      }
    } catch (error: any) {
      toast({ tone: "error", title: "Verification failed", description: error.message });
      setVerifyResult({ status: "ERROR" });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-foreground font-sans overflow-hidden relative">
      {/* Abstract Glowing Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Organiser Dashboard
              </h1>
            </div>
            <p className="text-gray-400 text-sm ml-1">Lighthouse IPFS & Polygon Smart Contracts</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge tone={wallet.isConnected ? "green" : "neutral"} className="px-3 py-1.5 backdrop-blur-md bg-white/5 border-white/10">
              <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
              {wallet.isConnected ? "Connected to Amoy" : "Not Connected"}
            </Badge>
            <ConnectWalletButton />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Sidebar Nav */}
          <aside className="space-y-4">
            <nav className="flex flex-col gap-2 p-3 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
              <button
                onClick={() => setActiveTab("issue")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm",
                  activeTab === "issue"
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <FileUp className="w-5 h-5" /> Issue Document
              </button>
              <button
                onClick={() => setActiveTab("verify")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm",
                  activeTab === "verify"
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Search className="w-5 h-5" /> Verify Document
              </button>
            </nav>

            {/* Quick Stats Widget */}
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Network Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Lighthouse IPFS</p>
                    <p className="text-xs text-green-400">Operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe2 className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Polygon Amoy</p>
                    <p className="text-xs text-green-400">Operational</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Dynamic Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === "issue" ? (
                <motion.div
                  key="issue"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/[0.02] backdrop-blur-2xl p-1 shadow-2xl">
                    <div className="p-6 sm:p-8 grid xl:grid-cols-2 gap-8">
                      {/* Left: Upload Area */}
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Issue New Document</h2>
                          <p className="text-sm text-gray-400">Securely hash, upload to Lighthouse IPFS, and anchor on Polygon.</p>
                        </div>

                        <label className="relative flex flex-col items-center justify-center h-64 border-2 border-dashed border-blue-500/30 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all cursor-pointer group overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <UploadCloud className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                          <p className="text-white font-medium mb-1 z-10">
                            {selectedFile ? selectedFile.name : "Drag & Drop or Click to Upload"}
                          </p>
                          <p className="text-xs text-gray-500 z-10">Any file type up to 50MB</p>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                          />
                        </label>

                        <Button
                          onClick={handleIssue}
                          disabled={!selectedFile || issueSteps.chain === "active" || issueSteps.upload === "active"}
                          className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 border-0"
                        >
                          {issueSteps.chain === "active" || issueSteps.upload === "active" ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                          ) : (
                            <><FileCheck2 className="w-5 h-5 mr-2" /> Issue Document</>
                          )}
                        </Button>
                      </div>

                      {/* Right: Status & Steps */}
                      <div className="flex flex-col justify-center space-y-6 bg-black/20 rounded-2xl p-6 border border-white/5">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Issuance Timeline</h3>

                        {/* Step 1 */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center mt-1">
                            <StatusIcon state={issueSteps.hash} />
                            <div className="w-px h-12 bg-white/10 mt-2" />
                          </div>
                          <div>
                            <p className={cn("font-medium", issueSteps.hash === "active" ? "text-blue-400" : "text-white")}>
                              SHA-256 Hashing
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Generate cryptographic proof</p>
                            {docHash && (
                              <p className="text-xs text-blue-300 font-mono mt-2 bg-blue-500/10 p-1.5 rounded truncate max-w-[200px]">
                                {shortenAddress(docHash, 8, 8)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center mt-1">
                            <StatusIcon state={issueSteps.upload} />
                            <div className="w-px h-12 bg-white/10 mt-2" />
                          </div>
                          <div>
                            <p className={cn("font-medium", issueSteps.upload === "active" ? "text-purple-400" : "text-white")}>
                              Lighthouse IPFS
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Upload and pin to decentralized storage</p>
                            {cid && (
                              <p className="text-xs text-purple-300 font-mono mt-2 bg-purple-500/10 p-1.5 rounded truncate max-w-[200px]">
                                {cid}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center mt-1">
                            <StatusIcon state={issueSteps.chain} />
                          </div>
                          <div>
                            <p className={cn("font-medium", issueSteps.chain === "active" ? "text-emerald-400" : "text-white")}>
                              Polygon Smart Contract
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Anchor proof permanently on-chain</p>
                            {txHash && (
                              <a
                                href={explorerTxUrl(txHash)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-xs text-emerald-400 font-mono mt-2 bg-emerald-500/10 p-1.5 rounded hover:bg-emerald-500/20 transition"
                              >
                                {shortenAddress(txHash, 8, 8)} <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Verify Authenticity</h2>
                      <p className="text-sm text-gray-400">Enter the document hash to query the Polygon smart contract.</p>
                    </div>

                    <div className="flex flex-col gap-4 mb-8">
                      <label className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-emerald-500/30 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all cursor-pointer group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <UploadCloud className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-white font-medium mb-1 z-10">
                          {verifyFile ? verifyFile.name : "Drag & Drop or Click to Upload Document for Verification"}
                        </p>
                        <p className="text-xs text-gray-500 z-10">We will securely hash this locally and check the blockchain</p>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleVerifyFile(e.target.files[0])}
                        />
                      </label>

                      {verifying && (
                        <div className="flex items-center justify-center py-4 text-emerald-400">
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                          <span>Generating Hash & Querying Polygon...</span>
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {(verifyResult || verifyHash) && !verifying && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "rounded-2xl border p-6 mt-4",
                            verifyResult?.success
                              ? "bg-emerald-500/10 border-emerald-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          )}
                        >
                          <div className="mb-6 space-y-2 border-b border-white/10 pb-4">
                            <p className="text-sm text-gray-400">Locally Generated Hash:</p>
                            <p className="text-sm text-white font-mono bg-black/40 p-2 rounded truncate">
                              {verifyHash}
                            </p>
                          </div>

                          {verifyResult?.success ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/20 pb-4">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                <div>
                                  <h3 className="text-lg font-bold text-emerald-100">Verified Authentic (Match)</h3>
                                  <p className="text-xs text-emerald-400/80 mt-1">
                                    The local hash matches the record on the Polygon Amoy blockchain.
                                  </p>
                                </div>
                              </div>
                              <InfoRow label="On-chain Hash" value={verifyHash} copy />
                              <InfoRow label="IPFS CID" value={verifyResult.ipfsCid} copy />
                              <InfoRow label="Timestamp" value={verifyResult.timestamp} />
                              <InfoRow label="Issuer" value={verifyResult.uploader} copy />
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                              <h3 className="text-lg font-bold text-red-100">Verification Failed (Mismatch)</h3>
                              <p className="text-sm text-red-300/70 mt-1">
                                The generated hash does not match any registered record on our smart contract. This document may be tampered with or not registered.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

// Subcomponents

function StatusIcon({ state }: { state: StepState }) {
  if (state === "complete") return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  if (state === "active") return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
  if (state === "error") return <XCircle className="w-5 h-5 text-red-400" />;
  return <div className="w-3 h-3 rounded-full bg-white/20 m-1" />;
}

function InfoRow({ label, value, copy }: { label: string, value: string, copy?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm font-medium text-emerald-100/60">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-white font-mono truncate max-w-[200px]">{value}</span>
        {copy && (
          <button
            onClick={() => copyText(value)}
            className="text-emerald-400 hover:text-emerald-300 p-1"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
