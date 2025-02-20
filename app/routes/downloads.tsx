import Container from "~/components/Container";
import type { Route } from "./+types/downloads";
import { H1, H2 } from "~/components/H1";
import { Card } from "~/components/Card";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Downloads\"); //@todo" },
    { name: "description", content: "Download page for the RoboLike application to automate your online social activities." },
  ];
}

export default function Downloads() {
  return <>
    <Container className="flex-col gap-4 mt-10">
      <div>
        <H1>Downloads</H1>
        I am the downloads page!
      </div>
      <div className="flex flex-row gap-4">
        <Card>
          <H2>MacOs</H2>
        </Card>
        <Card>
          <H2>Windows</H2>
        </Card>
        <Card>
          <H2>Linux</H2>
        </Card>
      </div>
    </Container>
  </>
}
