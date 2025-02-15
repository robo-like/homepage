
interface FooterProps {
    className?: string;
}

export function Footer({ className = '' }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`w-full bg-darkPurple text-white py-6 ${className}`}>
            <div className="max-w-[850px] mx-auto w-full px-4">
                <p className="text-md">© {currentYear} RoboLike. All rights reserved.</p>
            </div>
        </footer>
    );
}
