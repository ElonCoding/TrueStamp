"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useContract } from "@/hooks/useContract";
import { Loader2, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import ConnectWalletButton from "@/components/ConnectWalletButton";

type UserRole = "user" | "issuer" | "verifier";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { isConnected, address } = useAccount();
  const { getUserRole } = useContract();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      if (!isConnected || !address) {
        setRole(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const currentRole = await getUserRole(address);
        setRole(currentRole as UserRole);
      } catch (e) {
        console.error(e);
        setRole("user"); // fallback
      } finally {
        setLoading(false);
      }
    }
    checkRole();
  }, [isConnected, address, getUserRole]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <ShieldAlert className="w-16 h-16 text-electric-blue mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          Please connect your wallet to access this dashboard and verify your identity.
        </p>
        <ConnectWalletButton />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-electric-blue" />
        <p className="mt-4 text-gray-400">Verifying on-chain role...</p>
      </div>
    );
  }

  if (role && !allowedRoles.includes(role) && !allowedRoles.includes("user")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md p-8 text-center border-red-500/30 bg-red-500/5">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h2>
          <p className="text-gray-400 mb-6">
            Your connected wallet does not have the necessary smart contract roles to view this page. You are currently identified as a <strong className="text-white uppercase">{role}</strong>.
          </p>
          <ConnectWalletButton />
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
