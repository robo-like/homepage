import Container from "~/components/Container";
import type { Route } from "./+types/how-it-works";
import { H1 } from "~/components/H1";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"How it Works!\"); //@todo" },
    { name: "description", content: "RoboLike is an auto liker which means we like posts on your behalf (not the other way around). We don't give you fake likes, we reach out to real people." },
  ];
}

export default function HowItWorks() {
  return <>
    <Container className="mt-10">
      <H1>How it Works</H1>
      I am the how it works page!
    </Container>
  </>
}
