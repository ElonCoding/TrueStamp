import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';

const contractAddress = "0xe6Bb89943c731aaA6552c7F38c3c724af6BE6B15";

const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "cid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			}
		],
		"name": "DocumentAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_fileHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ipfsCid",
				"type": "string"
			}
		],
		"name": "uploadDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "documents",
		"outputs": [
			{
				"internalType": "string",
				"name": "fileHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsCid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_fileHash",
				"type": "string"
			}
		],
		"name": "verifyDocument",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const uploadToIPFS = async (file: File | FileList | any) => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
        if (!apiKey) {
            throw new Error("Lighthouse API Key is missing. Please add NEXT_PUBLIC_LIGHTHOUSE_API_KEY to your .env file.");
        }

        // lighthouse.upload accepts FileList or an array of Files
        const filesToUpload = file instanceof File ? [file] : file;
        
        const output = await lighthouse.upload(filesToUpload, apiKey);
        
        // Return the IPFS Hash (CID)
        return output.data.Hash;
    } catch (error) {
        console.error("Lighthouse Upload Error:", error);
        throw error;
    }
};

export const saveToPolygon = async (fileHash: string, ipfsCid: string) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) throw new Error("MetaMask is not installed!");
    
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    const tx = await contract.uploadDocument(fileHash, ipfsCid);
    await tx.wait();
    
    return tx.hash; // Return transaction hash
};

export const verifyDocumentOnPolygon = async (fileHash: string) => {
    try {
        const rpcUrl = process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
        const provider = new ethers.JsonRpcProvider(rpcUrl); 
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        const result = await contract.verifyDocument(fileHash); 
        
        // result[0] = IPFS CID, result[1] = Timestamp
        if (result[0] === "") {
            return { success: false, message: "Document Not Found!" };
        }
        
        return {
            success: true,
            ipfsCid: result[0],
            timestamp: new Date(Number(result[1]) * 1000).toLocaleString(),
            uploader: result[2]
        };
    } catch (error) {
        console.error("Verification Error:", error);
        return { success: false, message: "Invalid Hash or Network Error" };
    }
};
