'use client';

import React from 'react';
import { Beer, Flame, Music, ArrowUpRight } from 'lucide-react';
import ArtistCard from '../../components/ArtistCard';
import { FeatureItem } from '../../types';

interface EatDrinkSectionProps {
  foodDrink: FeatureItem[];
  onFeatureClick: (feature: FeatureItem) => void;
  handleBooking: () => void;
}

const EatDrinkSection: React.FC<EatDrinkSectionProps> = ({ foodDrink, onFeatureClick, handleBooking }) => {
  return (
    <section id="eat-drink" className="relative z-10 py-20 md:py-32 bg-brand-slate-deep border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16 px-4">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-brand-orange font-mono text-sm tracking-[0.3em] uppercase">Taste Makers</span>
              <div className="h-px w-12 bg-brand-orange" />
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase leading-none mb-6">
              More Than <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-[#fbbf24]">A Pub</span>
            </h2>
            <p className="text-lg text-gray-200 font-light leading-relaxed max-w-xl mb-8">
              Fizzy Moon is an extension of your night out. A place where the drinks are crafted in-house, the food is fire-kissed, and the music never stops.
            </p>
            <div className="flex flex-wrap gap-8 border-t border-white/10 pt-6">
              {[
                { icon: Beer, label: "Home Brews" },
                { icon: Flame, label: "Fire Grill" },
                { icon: Music, label: "Live Music" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80 group">
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-brand-orange transition-colors duration-300">
                    <item.icon className="w-4 h-4 text-brand-orange group-hover:text-black transition-colors duration-300" />
                  </div>
                  <span className="font-bold uppercase text-xs tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-start lg:justify-end pb-2">
            <button 
              onClick={handleBooking}
              className="group relative px-8 py-4 bg-white/5 border border-white/20 text-white font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-brand-orange hover:border-brand-orange hover:text-black overflow-hidden rounded-full"
              data-hover="true"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Now <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 bg-white/5 backdrop-blur-sm">
          {foodDrink.map((feature) => (
            <ArtistCard key={feature.id} artist={feature} onClick={() => onFeatureClick(feature)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EatDrinkSection;

