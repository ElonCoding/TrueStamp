import CryptoJS from "crypto-js";

export type SecureUploadStatus =
  | "hashing"
  | "encrypting"
  | "uploading"
  | "cid"
  | "deal"
  | "complete";

export type SecureUploadResult = {
  fileName: string;
  sha256Hash: string;
  cid: string;
  dealId: string;
  metadataURI: string;
  metadata: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    encrypted: true;
    encryption: "AES";
    sha256Hash: string;
    cid: string;
    dealId: string;
    createdAt: string;
  };
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const arrayBufferToWordArray = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i += 1) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
};

export const generateSha256Hash = async (file: File) => {
  const buffer = await file.arrayBuffer();
  return CryptoJS.SHA256(arrayBufferToWordArray(buffer)).toString();
};

export const encryptFile = async (file: File, secretKey: string) => {
  const buffer = await file.arrayBuffer();
  const wordArray = arrayBufferToWordArray(buffer);
  const base64File = CryptoJS.enc.Base64.stringify(wordArray);
  const encrypted = CryptoJS.AES.encrypt(base64File, secretKey).toString();
  return new File([encrypted], `${file.name}.bridge.enc`, {
    type: "application/octet-stream",
    lastModified: Date.now(),
  });
};

export const decryptEncryptedText = (encryptedText: string, secretKey: string) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error("Unable to decrypt file with the provided key.");
  return decrypted;
};

export const verifyEncryptedPayloadHash = (
  encryptedText: string,
  secretKey: string,
  expectedSha256Hash: string,
) => {
  const base64File = decryptEncryptedText(encryptedText, secretKey);
  const wordArray = CryptoJS.enc.Base64.parse(base64File);
  const regeneratedHash = CryptoJS.SHA256(wordArray).toString();
  return {
    regeneratedHash,
    matches:
      regeneratedHash.toLowerCase().replace(/^0x/, "") ===
      expectedSha256Hash.toLowerCase().replace(/^0x/, ""),
  };
};

export const fetchEncryptedPayload = async (cid: string) => {
  const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
  if (!response.ok) throw new Error("Unable to fetch encrypted IPFS payload.");
  return response.text();
};

const demoCid = (seed: string) =>
  `bafybei${btoa(seed).replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 38)}`;

const fetchDealId = async (cid: string) => {
  try {
    const response = await fetch(`https://api.lighthouse.storage/api/lighthouse/file_info?cid=${cid}`);
    if (!response.ok) throw new Error("Deal lookup failed");
    const payload = await response.json();
    const deal =
      payload?.fileInfo?.dealInfo?.[0]?.dealId ||
      payload?.dealInfo?.[0]?.dealId ||
      payload?.data?.dealId;
    return deal ? String(deal) : `pending-${cid.slice(-8)}`;
  } catch {
    return `demo-deal-${cid.slice(-10)}`;
  }
};

const uploadBlobToLighthouse = async (file: File, onProgress?: (progress: number) => void) => {
  const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;

  if (!apiKey) {
    for (const progress of [40, 58, 76, 100]) {
      onProgress?.(progress);
      await wait(180);
    }
    return demoCid(`${file.name}-${file.size}-${file.lastModified}`);
  }

  const body = new FormData();
  body.append("file", file);
  onProgress?.(44);

  const response = await fetch("https://node.lighthouse.storage/api/v0/add", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body,
  });

  onProgress?.(84);

  if (!response.ok) throw new Error("Lighthouse encrypted upload failed.");
  const payload = await response.json();
  onProgress?.(100);
  return payload.Hash || payload.cid || payload.data?.Hash;
};

export const secureUploadToLighthouse = async ({
  file,
  owner,
  secretKey,
  onProgress,
  onStatus,
}: {
  file: File;
  owner: string;
  secretKey: string;
  onProgress?: (progress: number) => void;
  onStatus?: (status: SecureUploadStatus) => void;
}): Promise<SecureUploadResult> => {
  onStatus?.("hashing");
  onProgress?.(8);
  const sha256Hash = await generateSha256Hash(file);

  onStatus?.("encrypting");
  onProgress?.(24);
  const encryptedFile = await encryptFile(file, secretKey);

  onStatus?.("uploading");
  const cid = await uploadBlobToLighthouse(encryptedFile, onProgress);

  onStatus?.("cid");
  await wait(220);

  onStatus?.("deal");
  const dealId = await fetchDealId(cid);

  const metadata = {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
    encrypted: true as const,
    encryption: "AES" as const,
    sha256Hash,
    cid,
    dealId,
    createdAt: new Date().toISOString(),
  };

  const metadataBlob = new File(
    [JSON.stringify({ owner, ...metadata }, null, 2)],
    `${file.name}.metadata.json`,
    { type: "application/json" },
  );
  const metadataCid = await uploadBlobToLighthouse(metadataBlob);

  onStatus?.("complete");
  onProgress?.(100);

  return {
    fileName: file.name,
    sha256Hash,
    cid,
    dealId,
    metadataURI: `ipfs://${metadataCid}`,
    metadata,
  };
};
