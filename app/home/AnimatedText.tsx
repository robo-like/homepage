import { useEffect, useRef } from "react";
import "./Accordion.css";

export function AnimatedText() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text =
      "Getting started is as easy as • Getting started is as easy as • Getting started is as easy as • Getting started is as easy as • Getting started is as easy as • Getting started is as easy as • Getting started is as easy as • Getting started is as easy as • Getting started is as easy as • ";
    const delay = 20;

    if (textRef.current) {
      textRef.current.innerHTML = text
        .split("")
        .map((letter) => `<span>${letter}</span>`)
        .join("");

      Array.from(textRef.current.children).forEach((span, index) => {
        setTimeout(
          () => {
            span.classList.add("wavy");
          },
          index * 60 + delay
        );
      });
    }
  }, []);

  return (
    <div className="w-full overflow-hidden mb-6 pb-5 pt-5">
      <div
        className="animate-squiggly whitespace-pre text-[#ccc] text-lg glow-effect"
        ref={textRef}
      >
        {/* The text content is dynamically generated in useEffect */}
      </div>
    </div>
  );
}
