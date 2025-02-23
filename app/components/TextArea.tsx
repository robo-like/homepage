import { cn } from "~/lib/utils";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">
                {label}
            </label>
            <textarea
                className={cn(
                    "px-3 py-2 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A1E55] min-h-[100px] resize-y",
                    error && "border-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
} 