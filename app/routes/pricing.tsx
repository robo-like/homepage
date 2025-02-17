import type { Route } from "./+types/pricing";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Pricing!\"); //@todo" },
    { name: "description", content: "RoboLike is an auto liker which means we like posts on your behalf (not the other way around). We don't give you fake likes, we reach out to real people." },
  ];
}

export default function Pricing() {
  return <>I am the pricing page!</>
}
