// app/welcome/Accordion.tsx
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  faqData: FAQItem[];
}

export function Accordion({ faqData }: AccordionProps) {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? -1 : index);
  };

  return (
    <section className="faq-section">
      <h2 className="text-4xl font-bold mb-4 py-2">FAQ</h2>
      <div className="accordion">
        {faqData.map((item, index) => (
          <div key={index} className="accordion-item">
            <button
              className="accordion-header text-xl font-bold border-1 border-dashed p-2 w-full text-left hover:cursor-pointer"
              onClick={() => toggleSection(index)}
            >
              {item.question}
            </button>
            <div
              className={`accordion-content ${openSection === index ? 'open' : ''
                }`}
              style={{
                maxHeight: openSection === index ? '200px' : '0',
                opacity: openSection === index ? 1 : 0,
                transition: 'max-height 0.3s ease, opacity 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}