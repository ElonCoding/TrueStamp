export const uploadToIpfs = async (
  file: File,
  onProgress?: (progress: number) => void,
) => {
  const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;

  if (!apiKey) {
    for (const progress of [18, 44, 73, 100]) {
      onProgress?.(progress);
      await new Promise((resolve) => window.setTimeout(resolve, 180));
    }
    const seed = `${file.name}-${file.size}-${file.lastModified}`;
    return `bafybei${btoa(seed).replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 38)}`;
  }

  const body = new FormData();
  body.append("file", file);
  onProgress?.(20);

  const response = await fetch("https://node.lighthouse.storage/api/v0/add", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body,
  });

  onProgress?.(82);

  if (!response.ok) {
    throw new Error("Lighthouse upload failed. Demo CID fallback is available.");
  }

  const payload = await response.json();
  onProgress?.(100);
  return payload.Hash || payload.cid || payload.data?.Hash;
};
