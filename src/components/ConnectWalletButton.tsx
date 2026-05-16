"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton({ compact = false }: { compact?: boolean }) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={`glow-border font-bold text-white transition-all bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 hover:from-electric-blue/40 hover:to-neon-purple/40 rounded-full flex items-center justify-center ${compact ? 'px-4 py-2 text-sm' : 'px-8 py-4 text-base'}`}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={`border border-red-500 bg-red-500/10 text-red-500 font-bold rounded-full flex items-center justify-center hover:bg-red-500/20 transition-all ${compact ? 'px-4 py-2 text-sm' : 'px-8 py-4 text-base'}`}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className={`hidden sm:flex border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full items-center justify-center transition-all ${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'}`}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: compact ? 16 : 20,
                          height: compact ? 16 : 20,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 8,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: compact ? 16 : 20, height: compact ? 16 : 20 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className={`border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full flex items-center justify-center transition-all ${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'}`}
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
