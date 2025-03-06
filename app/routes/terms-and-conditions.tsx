import Container from "~/components/Container";
import type { Route } from "./+types/downloads";
import { H1, H2 } from "~/components/H1";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Terms and Conditions - RoboLike" },
    { name: "description", content: "Terms and conditions for using the RoboLike application." },
  ];
}

export default function TermsAndConditions() {
  return (
    <Container className="flex-col gap-8 my-10">
      <H1>Terms and Conditions</H1>

      <section className="prose prose-invert max-w-none">
        <H2>1. Acceptance of Terms</H2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <H2>2. Use License</H2>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        <H2>3. Disclaimer</H2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

        <H2>4. Limitations</H2>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <H2>5. Revisions and Errata</H2>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.
        </p>

        <H2>6. Links</H2>
        <p>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
        </p>

        <H2>7. Governing Law</H2>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Last updated: 24/02/2025
          </p>
        </div>
      </section>
    </Container>
  );
}
