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
      className={`leading-6 text-center transition-all hover:text-black ${
        isActive 
          ? "font-bold text-black" 
          : "font-medium text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
