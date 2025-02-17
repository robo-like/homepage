import type { Route } from "./+types/home";
import { Home as HomePage } from "../home/Home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Home\"); //@todo" },
    { name: "description", content: "Welcome to RoboLike! Your entry point to reaching your fans, audience, customers, all at the click of a robots button." },
  ];
}

export default function Home() {
  return <HomePage />;

}
