import type { Route } from "./+types/home";
import { Downloads as DownloadPage } from "../downloads/downloads";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "const page = new RoboLike(\"Downloads\"); //@todo" },
    { name: "description", content: "Download page for the RoboLike application to automate your online social activities." },
  ];
}

export default function Downloads() {
  return <DownloadPage />;
}
