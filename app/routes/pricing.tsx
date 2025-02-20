import Container from "~/components/Container";
import type { Route } from "./+types/pricing";
import { H1 } from "~/components/H1";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Pricing!\"); //@todo" },
    { name: "description", content: "RoboLike is an auto liker which means we like posts on your behalf (not the other way around). We don't give you fake likes, we reach out to real people." },
  ];
}

export default function Pricing() {
  return <>
    <Container className="mt-10">
      <H1>Pricing</H1>
      I am the pricing page!
    </Container>
  </>
}
