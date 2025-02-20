import { cn } from "~/lib/utils";

interface ContainerProps {
    children: React.ReactNode;
    fluid?: boolean;
    className?: string;
}

const Container = ({ children, fluid = false, className = '' }: ContainerProps) => {
    if (!fluid) {
        return (
            <section className="flex flex-col justify-center items-center w-full">
                <section className={cn(
                    "max-w-[850px] flex flex-col gap-6 w-full px-4",
                    className
                )}>
                    {children}
                </section>
            </section>
        );
    }

    return (
        <section className={cn(
            "flex justify-center items-center w-full md:py-10 max-w-[1300px] mx-auto",
            className
        )}>
            {children}
        </section>
    );
};

export default Container;

