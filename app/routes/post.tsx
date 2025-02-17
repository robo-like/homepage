import type { Route } from "./+types/post";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Post + {{title}}\"); //@todo" },
    { name: "description", content: "{{post summary here}}" },
  ];
}

export default function Post() {
  return <>I am the a single post view!</>
}
