'use client';

import React from 'react';
import ArtistCard from '../../components/ArtistCard';
import { FeatureItem } from '../../types';

interface WhatsOnSectionProps {
  events: FeatureItem[];
  onFeatureClick: (feature: FeatureItem) => void;
}

const WhatsOnSection: React.FC<WhatsOnSectionProps> = ({ events, onFeatureClick }) => {
  return (
    <section id="whats-on" className="relative z-10 py-20 md:py-32 bg-brand-slate-dark border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-16">
          <span className="text-brand-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">Live & Loud</span>
          <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase text-center">
            What's <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">On</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
          {events.map((feature) => (
            <ArtistCard key={feature.id} artist={feature} onClick={() => onFeatureClick(feature)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatsOnSection;

