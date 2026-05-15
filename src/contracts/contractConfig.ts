export const POLYGON_AMOY = {
  chainId: 80002,
  hexChainId: "0x13882",
  name: "Polygon Amoy",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrl:
    process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL ||
    "https://rpc-amoy.polygon.technology/",
  explorerUrl: "https://amoy.polygonscan.com",
};

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export const BRIDGE_ABI = [
  "function issueBatch(address[] students, string[] hashes, string[] cids, string documentType) external",
  "function documents(string docId) view returns (address owner, string hash, string cid, uint256 timestamp, bool isRevoked, string txHash)",
  "function getMyDocuments() view returns (tuple(string id,string name,string docType,string cid,string txHash,uint256 timestamp,bool isRevoked)[])",
];

export const explorerTxUrl = (txHash: string) =>
  `${POLYGON_AMOY.explorerUrl}/tx/${txHash}`;

export const explorerAddressUrl = (address: string) =>
  `${POLYGON_AMOY.explorerUrl}/address/${address}`;
