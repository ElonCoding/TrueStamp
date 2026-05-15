"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, ShieldCheck, UserRound } from "lucide-react";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const roles = [
  {
    title: "Owner / User Dashboard",
    href: "/user",
    description: "Fetch wallet-owned credentials, open IPFS records, and share Polygon Amoy proofs.",
    icon: UserRound,
    badge: "My documents",
  },
  {
    title: "Organiser Dashboard",
    href: "/organiser",
    description: "Issue new documents, pin proofs to IPFS, and verify document IDs against the contract.",
    icon: Building2,
    badge: "Issuer console",
  },
];

export default function DashboardHub() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_24%_10%,rgba(0,240,255,0.18),transparent_30%),radial-gradient(circle_at_78%_28%,rgba(176,38,255,0.16),transparent_34%),linear-gradient(180deg,#050816,#070a18)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 lg:px-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="TrueStamp Logo" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-xl font-bold">TrueStamp</p>
              <p className="text-sm text-gray-500">Web3 document verification platform</p>
            </div>
          </div>
          <ConnectWalletButton />
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.95fr_1fr]">
          <div>
            <Badge tone="cyan">Polygon Amoy • IPFS • MetaMask</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
              One platform for issued documents and verifiable trust.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
              Choose a workspace to issue credentials as an organiser or manage proofs as a document owner. The app keeps live blockchain flows ready while demo fallbacks protect the judging experience.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["1,284", "Docs issued"],
                ["99.98%", "Proof uptime"],
                ["2.1s", "Avg verify"],
              ].map(([value, label]) => (
                <Card key={label} className="p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-500">{label}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="group p-5 transition hover:border-electric-blue/30 hover:bg-white/[0.08]">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex gap-4">
                        <div className="h-fit rounded-2xl bg-white/8 p-3 text-electric-blue">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <Badge tone="purple">{role.badge}</Badge>
                          <h2 className="mt-3 text-2xl font-bold text-white">{role.title}</h2>
                          <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">{role.description}</p>
                        </div>
                      </div>
                      <Button type="button" onClick={() => (window.location.href = role.href)}>
                        Open
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
