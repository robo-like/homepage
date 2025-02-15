import type { Route } from "./+types/home";
import { Welcome } from "../home/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Home\"); //@todo" },
    { name: "description", content: "Welcome to RoboLike! Your entry point to reaching your fans, audience, customers, all at the click of a robots button." },
  ];
}

export default function Home() {
  return <Welcome />;

}
