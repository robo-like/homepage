import { cn } from "~/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
