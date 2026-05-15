"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BrowserProvider } from "ethers";
import { POLYGON_AMOY } from "@/contracts/contractConfig";
import { useToast } from "@/components/ui/toast";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

type WalletContextValue = {
  address: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  hasMetaMask: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToAmoy: () => Promise<void>;
  getProvider: () => BrowserProvider;
};

const WalletContext = createContext<WalletContextValue | null>(null);
const SESSION_KEY = "the_bridge_wallet_session";

const parseChainId = (value: unknown) => {
  if (typeof value === "string") return Number.parseInt(value, 16);
  if (typeof value === "number") return value;
  return null;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const hasMetaMask = typeof window !== "undefined" && Boolean(window.ethereum);
  const isConnected = Boolean(address);
  const isCorrectNetwork = chainId === POLYGON_AMOY.chainId;

  const getProvider = useCallback(() => {
    if (!window.ethereum) throw new Error("MetaMask is not installed.");
    return new BrowserProvider(window.ethereum);
  }, []);

  const refreshChain = useCallback(async () => {
    if (!window.ethereum) return;
    const nextChainId = await window.ethereum.request({ method: "eth_chainId" });
    setChainId(parseChainId(nextChainId));
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        tone: "error",
        title: "MetaMask not detected",
        description: "Install MetaMask to connect a wallet on Polygon Amoy.",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const nextAddress = accounts?.[0] || "";
      setAddress(nextAddress);
      localStorage.setItem(SESSION_KEY, "true");
      await refreshChain();
      toast({
        tone: "success",
        title: "Wallet connected",
        description: nextAddress,
      });
    } catch (error) {
      toast({
        tone: "error",
        title: "Wallet connection failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [refreshChain, toast]);

  const disconnect = useCallback(() => {
    setAddress("");
    localStorage.removeItem(SESSION_KEY);
    toast({ tone: "info", title: "Wallet disconnected" });
  }, [toast]);

  const switchToAmoy = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: POLYGON_AMOY.hexChainId }],
      });
      await refreshChain();
      toast({ tone: "success", title: "Switched to Polygon Amoy" });
    } catch {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: POLYGON_AMOY.hexChainId,
              chainName: POLYGON_AMOY.name,
              nativeCurrency: POLYGON_AMOY.nativeCurrency,
              rpcUrls: [POLYGON_AMOY.rpcUrl],
              blockExplorerUrls: [POLYGON_AMOY.explorerUrl],
            },
          ],
        });
        await refreshChain();
        toast({ tone: "success", title: "Polygon Amoy added" });
      } catch (error) {
        toast({
          tone: "error",
          title: "Network switch failed",
          description: error instanceof Error ? error.message : "Open MetaMask and switch manually.",
        });
      }
    }
  }, [refreshChain, toast]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccounts = (...args: unknown[]) => {
      const accounts = (args[0] as string[]) || [];
      setAddress(accounts[0] || "");
      if (!accounts[0]) localStorage.removeItem(SESSION_KEY);
    };
    const handleChain = (...args: unknown[]) => setChainId(parseChainId(args[0]));

    window.ethereum.on?.("accountsChanged", handleAccounts);
    window.ethereum.on?.("chainChanged", handleChain);
    queueMicrotask(() => void refreshChain());

    if (localStorage.getItem(SESSION_KEY) === "true") {
      queueMicrotask(() => {
        window.ethereum
          ?.request({ method: "eth_accounts" })
          .then((accounts) => setAddress(((accounts as string[]) || [])[0] || ""))
          .catch(() => undefined);
      });
    }

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccounts);
      window.ethereum?.removeListener?.("chainChanged", handleChain);
    };
  }, [refreshChain]);

  const value = useMemo(
    () => ({
      address,
      chainId,
      isConnected,
      isConnecting,
      isCorrectNetwork,
      hasMetaMask,
      connect,
      disconnect,
      switchToAmoy,
      getProvider,
    }),
    [
      address,
      chainId,
      connect,
      disconnect,
      getProvider,
      hasMetaMask,
      isConnected,
      isConnecting,
      isCorrectNetwork,
      switchToAmoy,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside WalletProvider");
  return context;
};
