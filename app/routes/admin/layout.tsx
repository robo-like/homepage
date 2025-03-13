import { Outlet } from "react-router";
import { Header } from "~/components/Header";
import type { Route } from "./+types/layout"
export async function loader({ request }: Route.ClientLoaderArgs) {
    const url = new URL(request.url);
    if (!url.hostname.includes('localhost')) {
        throw new Response('Not Found', { status: 404 });
    }
}

export default function Layout() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pb-15">
                    <Outlet />
                </main>
            </div>
        </>
    );
}
