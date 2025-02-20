import { cn } from "~/lib/utils";

interface HeadingProps {
    children: React.ReactNode;
    className?: string;
}

export function H1({ children, className }: HeadingProps) {
    return (
        <h1 className={cn("text-4xl font-bold mb-4", className)}>
            {children}
        </h1>
    );
}

export function H2({ children, className }: HeadingProps) {
    return (
        <h2 className={cn("text-3xl font-bold mb-3", className)}>
            {children}
        </h2>
    );
}

export function H3({ children, className }: HeadingProps) {
    return (
        <h3 className={cn("text-2xl font-bold mb-2", className)}>
            {children}
        </h3>
    );
}

export function H4({ children, className }: HeadingProps) {
    return (
        <h4 className={cn("text-xl font-bold mb-2", className)}>
            {children}
        </h4>
    );
}

export function H5({ children, className }: HeadingProps) {
    return (
        <h5 className={cn("text-lg font-bold mb-2", className)}>
            {children}
        </h5>
    );
}
