'use client';

import React from 'react';
import FAQAccordion from '../../components/FAQAccordion';

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="relative z-10 py-20 md:py-32 bg-brand-slate-darker border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4">
            Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">Questions</span>
          </h2>
          <p className="text-gray-300">Everything you need to know before you go.</p>
        </div>
        <FAQAccordion />
      </div>
    </section>
  );
};

export default FAQSection;

