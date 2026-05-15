import React from "react";
import { AlertTriangle, LogOut, Wallet, Zap } from "lucide-react";
import { useWallet } from "@/components/walletProvider";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";

export default function ConnectWalletButton({ compact = false }: { compact?: boolean }) {
  const wallet = useWallet();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {wallet.isConnected && !wallet.isCorrectNetwork && (
        <Button
          type="button"
          variant="secondary"
          size={compact ? "sm" : "md"}
          onClick={wallet.switchToAmoy}
          className="border-orange-400/30 bg-orange-400/10 text-orange-200 hover:bg-orange-400/20"
        >
          <AlertTriangle className="h-4 w-4" />
          Polygon Amoy
        </Button>
      )}
      <Button
        type="button"
        onClick={wallet.isConnected ? wallet.disconnect : wallet.connect}
        disabled={wallet.isConnecting}
        size={compact ? "sm" : "lg"}
        className="glow-border"
      >
        {wallet.isConnecting ? (
          <>
            <Zap className="h-4 w-4 animate-pulse" />
            Connecting...
          </>
        ) : wallet.isConnected ? (
          <>
            <Wallet className="h-4 w-4" />
            Connected • {shortenAddress(wallet.address, 4, 2)}
            {!compact && <LogOut className="h-4 w-4 opacity-70" />}
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    </div>
  );
}
