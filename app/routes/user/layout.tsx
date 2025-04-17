import { Form, Outlet, useActionData, useLoaderData } from "react-router";
import { AuthCard } from "~/components/AuthCard";
export { action, loader } from "./profile.server";


// Client component section
export default function ProfileLayout() {

  return (
    <AuthCard title="YOUR PROFILE" className="max-w-xl mb-16">
      <Outlet />
    </AuthCard>
  );
}
