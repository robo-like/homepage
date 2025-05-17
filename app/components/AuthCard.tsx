import { cn } from "~/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function AuthCard({ children, className, title }: AuthCardProps) {
  return (
    <div
      className={cn(
        "max-w-md mx-auto p-6 text-black dark:text-white bg-white/95 dark:bg-white/20 rounded-lg shadow-md mt-16",
        className
      )}
    >
      {title && (
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            {title}
          </h1>
          <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
        </div>
      )}
      {children}
    </div>
  );
}
