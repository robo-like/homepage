import { Outlet } from "react-router";
import { Header } from "~/components/Header";

export async function loader() {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!window.location.hostname.includes('localhost')) {
        throw new Response('Not Found', { status: 404 });
    }

    return null;
}

export default function Layout() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Outlet />
                </main>
            </div>
        </>
    );
}
