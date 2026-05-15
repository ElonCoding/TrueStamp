"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

const variants = {
  primary:
    "bg-gradient-to-r from-electric-blue to-neon-purple text-white shadow-[0_0_24px_rgba(0,240,255,0.24)] hover:brightness-110",
  secondary:
    "border border-white/10 bg-white/8 text-white hover:bg-white/12 hover:border-white/20",
  ghost: "text-gray-300 hover:bg-white/10 hover:text-white",
  danger: "border border-red-400/30 bg-red-500/15 text-red-200 hover:bg-red-500/25",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
