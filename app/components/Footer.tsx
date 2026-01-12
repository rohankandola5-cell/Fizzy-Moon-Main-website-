'use client';

import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-brand-slate-deep backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="mb-6 relative h-12 md:h-14 w-auto">
            <Image 
              src="/images/logo/fizzy_moon_white_final.png" 
              alt="Fizzy Moon" 
              width={200}
              height={56}
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex gap-2 text-xs font-mono text-gray-300">
            <span>35 Regent St, Leamington Spa CV32 5EE</span>
          </div>
        </div>
        
        <div className="flex gap-6 md:gap-8 flex-wrap">
          <a href="#" className="text-gray-300 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
            Instagram
          </a>
          <a href="#" className="text-gray-300 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

