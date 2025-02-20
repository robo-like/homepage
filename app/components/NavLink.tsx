import { Link, useLocation } from "react-router";

interface NavLinkProps {
    to: string;
    children: React.ReactNode;
    active?: boolean;
}

const NavLink = ({ to, children, active: forcedActive }: NavLinkProps) => {
    const location = useLocation();
    const isActive = forcedActive ?? location.pathname === to;

    return (
        <Link
            to={to}
            className={`leading-6 text-gray-700 dark:text-gray-200 text-center ${isActive ? 'font-bold' : 'font-normal'
                }`}
        >
            {children}
        </Link>
    );
};

export default NavLink;