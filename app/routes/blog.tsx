import type { Route } from "./+types/blog";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Blog\"); //@todo" },
    { name: "description", content: "RoboLike blog: sharing our story and tips and tricks for how to get the most out of your automations." },
  ];
}

export default function Blog() {
  return <>I am the blog!</>
}
