import React from "react";
import { cn } from "@/lib/utils";

const toneMap = {
  cyan: "border-electric-blue/30 bg-electric-blue/12 text-electric-blue",
  green: "border-green-400/30 bg-green-400/12 text-green-300",
  orange: "border-orange-400/30 bg-orange-400/12 text-orange-300",
  red: "border-red-400/30 bg-red-400/12 text-red-300",
  purple: "border-neon-purple/30 bg-neon-purple/12 text-purple-200",
  neutral: "border-white/10 bg-white/8 text-gray-300",
};

export const Badge = ({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneMap }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
      toneMap[tone],
      className,
    )}
    {...props}
  />
);
