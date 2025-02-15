import { Outlet } from "react-router";
import { Header } from "~/components/Header";
import type { Route } from "./+types/layout";
import { Footer } from "./components/Footer";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "const page = new RoboLike(\"(internal) Layout\"); //@todo" },
        { name: "description", content: "***INTERAL USE ONLY*** this page is a backdoor." },
    ];
}
export default function Layout() {
    return (
        <>
            {/* wrapping the outside section */}
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <div className="text-red">Where am I? </div>

                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
}
