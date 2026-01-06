/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do I need to book a table?",
    answer: "Walk-ins are always welcome in our main bar and garden! However, for Friday and Saturday nights or our famous Sunday Roast, we highly recommend booking in advance to avoid disappointment. Our VIP Hut and Luxe Lounge must be pre-booked."
  },
  {
    question: "Are children allowed?",
    answer: "Yes, little ones are welcome until 8pm. We have a dedicated kids menu available. After 8pm, we operate as an 18+ venue to maintain our evening atmosphere."
  },
  {
    question: "Is Fizzy Moon dog friendly?",
    answer: "Absolutely! We love dogs. Well-behaved pooches are welcome in the bar area and our heated beer garden. We even have water bowls and treats available behind the bar!"
  },
  {
    question: "Do you cater for dietary requirements?",
    answer: "We offer a wide range of Vegetarian, Vegan, and Gluten-Free options. Please speak to your server about any specific allergies before ordering, and our kitchen team will take care of you."
  },
  {
    question: "Is there a dress code?",
    answer: "Our dress code is smart-casual. We want you to feel comfortable, but we ask for no gym wear or work boots in the evenings, please."
  },
  {
    question: "Do you have parking?",
    answer: "We don't have our own car park, but there is plenty of on-street parking nearby (Regent Street) and several public car parks within a few minutes' walk in Leamington Spa."
  }
];

const FAQAccordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div 
            key={index} 
            className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'bg-white/10 border-[#f78e2c]/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
          >
            <button
              onClick={() => toggleIndex(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f78e2c] rounded-2xl group"
            >
              <span className={`text-lg md:text-xl font-bold font-heading uppercase tracking-wide transition-colors ${isOpen ? 'text-[#f78e2c]' : 'text-white group-hover:text-white/90'}`}>
                {faq.question}
              </span>
              <span className={`p-2 rounded-full border transition-all ${isOpen ? 'bg-[#f78e2c] border-[#f78e2c] text-black rotate-180' : 'border-white/20 text-white group-hover:border-white/40'}`}>
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-gray-300 leading-relaxed font-light text-lg">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;