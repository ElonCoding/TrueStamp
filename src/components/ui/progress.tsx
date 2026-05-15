import { cn } from "@/lib/utils";

export const Progress = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => (
  <div className={cn("h-2 overflow-hidden rounded-full bg-white/10", className)}>
    <div
      className="h-full rounded-full bg-gradient-to-r from-electric-blue via-cyan to-neon-purple transition-all duration-500"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);
