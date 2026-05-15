export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const shortenAddress = (address?: string, left = 6, right = 4) => {
  if (!address) return "";
  if (address.length <= left + right) return address;
  return `${address.slice(0, left)}...${address.slice(-right)}`;
};

export const formatDate = (value?: number | string | bigint) => {
  if (!value) return "Demo record";
  const numeric = typeof value === "bigint" ? Number(value) : Number(value);
  const date = new Date(numeric < 10_000_000_000 ? numeric * 1000 : numeric);
  return Number.isNaN(date.getTime())
    ? "Demo record"
    : date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
};

export const copyText = async (text: string) => {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
