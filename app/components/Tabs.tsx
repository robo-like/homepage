import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export interface Tab {
    label: string;
    to: string;
    comingSoon?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
    const location = useLocation();

    return (
        <div className={cn("border-b border-gray-700/50", className)}>
            <nav className="flex" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.to;

                    return (
                        <Link
                            key={tab.to}
                            to={tab.to}
                            className={cn(
                                "platform-tab py-3 px-6 font-medium text-sm transition-colors relative group",
                                isActive
                                    ? "active text-[#07b0ef] bg-[rgba(7,176,239,0.2)] rounded-t-lg border-b-3 border-[#07b0ef]"
                                    : "text-gray-400 hover:text-[#07b0ef] hover:bg-[rgba(7,176,239,0.1)]"
                            )}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {tab.label}
                            {tab.comingSoon && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-[#FA8E10] text-white rounded-full inline-flex items-center justify-center">
                                    Soon
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
} 