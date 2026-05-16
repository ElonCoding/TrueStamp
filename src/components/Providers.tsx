"use client";

import React, { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ToastProvider } from "@/components/ui/toast";

// Wagmi & RainbowKit Config
const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  transports: {
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

// Apollo GraphQL Client
const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
      "https://api.thegraph.com/subgraphs/name/truestamp",
  }),
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
            accentColor: "#b026ff",
            accentColorForeground: "white",
            borderRadius: "large",
          })}>
          <ApolloProvider client={apolloClient}>
            <ToastProvider>{children}</ToastProvider>
          </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
