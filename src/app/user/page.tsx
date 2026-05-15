"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clipboard,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { useWallet } from "@/components/walletProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { explorerTxUrl } from "@/contracts/contractConfig";
import { ChainDocument, demoDocuments, useContract } from "@/hooks/useContract";
import { copyText, formatDate, shortenAddress } from "@/lib/utils";

const ipfsGateway = (cid: string) => `https://ipfs.io/ipfs/${cid}`;

export default function UserDashboard() {
  const wallet = useWallet();
  const { fetchMyDocs } = useContract();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ChainDocument[]>(demoDocuments);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"chain" | "demo">("demo");

  useEffect(() => {
    const load = async () => {
      if (!wallet.isConnected || !wallet.isCorrectNetwork) {
        setDocuments(demoDocuments);
        setSource("demo");
        return;
      }

      setLoading(true);
      try {
        const docs = await fetchMyDocs();
        setDocuments(docs.length ? docs : demoDocuments);
        setSource(docs.length ? "chain" : "demo");
      } catch {
        setDocuments(demoDocuments);
        setSource("demo");
        toast({
          tone: "info",
          title: "Showing demo certificates",
          description: "Live document fetch is unavailable in this environment.",
        });
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [fetchMyDocs, toast, wallet.isConnected, wallet.isCorrectNetwork]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_10%_10%,rgba(0,240,255,0.16),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(255,0,255,0.12),transparent_30%),linear-gradient(180deg,#050816,#070a18)]" />
      <div className="mx-auto w-full max-w-7xl px-4 py-5 lg:px-6">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <Badge tone={source === "chain" ? "green" : "purple"}>
              {source === "chain" ? "Live wallet documents" : "Demo mode enabled"}
            </Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Owner Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              View your verified documents, open IPFS records, and share blockchain transaction proofs from one wallet-native workspace.
            </p>
          </div>
          <ConnectWalletButton />
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <Metric label="Verified documents" value={String(documents.filter((doc) => !doc.isRevoked && Number(doc.timestamp) > 0).length)} />
          <Metric label="Pending proofs" value={String(documents.filter((doc) => Number(doc.timestamp) === 0).length)} />
          <Metric label="Wallet" value={wallet.address ? shortenAddress(wallet.address, 5, 4) : "Not connected"} />
        </section>

        {!wallet.isConnected && (
          <Card className="mb-6 flex flex-col items-start gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-electric-blue/12 p-3 text-electric-blue">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Connect to fetch your live certificates</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Demo certificates are visible until MetaMask is connected on Polygon Amoy.
                </p>
              </div>
            </div>
            <ConnectWalletButton compact />
          </Card>
        )}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-5">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="mt-5 h-28 w-full" />
                <Skeleton className="mt-5 h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : documents.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc, index) => (
              <DocumentCard key={`${doc.id}-${index}`} doc={doc} />
            ))}
          </div>
        ) : (
          <Card className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
            <FolderOpen className="h-16 w-16 text-gray-500" />
            <h2 className="mt-5 text-2xl font-bold">No documents yet</h2>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              Once an organiser issues a credential to your wallet, it will appear here with IPFS and Polygon Amoy proof links.
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <Card className="p-5">
    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{label}</p>
    <p className="mt-3 text-2xl font-bold text-white">{value}</p>
  </Card>
);

const DocumentCard = ({ doc }: { doc: ChainDocument }) => {
  const status =
    doc.isRevoked ? "REVOKED" : Number(doc.timestamp) > 0 ? "VERIFIED" : "PENDING";
  const tone = status === "VERIFIED" ? "green" : status === "REVOKED" ? "orange" : "purple";

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-2xl bg-white/8 p-3 text-electric-blue">
            <FileText className="h-6 w-6" />
          </div>
          <Badge tone={tone}>{status}</Badge>
        </div>
        <h2 className="mt-5 text-xl font-bold text-white">{doc.name}</h2>
        <p className="mt-1 text-sm text-gray-500">{doc.docType} • {formatDate(doc.timestamp)}</p>
        <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
          <ProofRow label="Document ID" value={doc.id} copyValue={doc.id} />
          <ProofRow label="IPFS CID" value={shortenAddress(doc.cid, 10, 8)} copyValue={doc.cid} />
          <ProofRow label="Tx Hash" value={doc.txHash ? shortenAddress(doc.txHash, 10, 8) : "Pending"} copyValue={doc.txHash} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.open(ipfsGateway(doc.cid), "_blank", "noopener,noreferrer")}
            disabled={!doc.cid}
          >
            <Download className="h-4 w-4" />
            IPFS
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => doc.txHash && window.open(explorerTxUrl(doc.txHash), "_blank", "noopener,noreferrer")}
            disabled={!doc.txHash}
          >
            <ExternalLink className="h-4 w-4" />
            Explorer
          </Button>
        </div>
      </Card>
    </motion.article>
  );
};

const ProofRow = ({
  label,
  value,
  copyValue,
}: {
  label: string;
  value: string;
  copyValue?: string;
}) => {
  const { toast } = useToast();
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <button
        type="button"
        onClick={async () => {
          if (copyValue && (await copyText(copyValue))) {
            toast({ tone: "success", title: `${label} copied` });
          }
        }}
        className="inline-flex min-w-0 items-center gap-2 text-right text-gray-200 hover:text-white"
      >
        <span className="truncate">{value}</span>
        {copyValue && <Clipboard className="h-3.5 w-3.5 shrink-0" />}
      </button>
    </div>
  );
};
