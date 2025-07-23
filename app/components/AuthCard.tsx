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
        "max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-sm border border-gray-200",
        className
      )}
    >
      {title && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      )}
      {children}
    </div>
  );
}
