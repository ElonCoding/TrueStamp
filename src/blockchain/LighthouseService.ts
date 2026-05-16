import lighthouse from '@lighthouse-web3/sdk';

export const uploadToIPFS = async (file: File | FileList) => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
        if (!apiKey) {
            throw new Error("Lighthouse API Key is missing. Please add NEXT_PUBLIC_LIGHTHOUSE_API_KEY to your .env file.");
        }

        const filesToUpload = file instanceof File ? [file] : file;
        const output = await lighthouse.upload(filesToUpload, apiKey);
        
        return output.data.Hash;
    } catch (error) {
        console.error("Lighthouse Upload Error:", error);
        throw error;
    }
};

export const uploadMetadataToIPFS = async (metadata: Record<string, unknown>) => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
        if (!apiKey) {
            throw new Error("Lighthouse API Key is missing. Please add NEXT_PUBLIC_LIGHTHOUSE_API_KEY to your .env file.");
        }

        const jsonString = JSON.stringify(metadata);
        const output = await lighthouse.uploadText(jsonString, apiKey, "metadata.json");
        
        return output.data.Hash;
    } catch (error) {
        console.error("Lighthouse Metadata Upload Error:", error);
        throw error;
    }
};
