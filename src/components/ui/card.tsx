import React from "react";
import { cn } from "@/lib/utils";

export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl",
      className,
    )}
    {...props}
  />
);
