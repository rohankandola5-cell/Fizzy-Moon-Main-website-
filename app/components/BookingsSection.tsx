'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, Clock, Crown, Flame, PartyPopper, Star, Wine } from 'lucide-react';

interface BookingsSectionProps {
  handleBooking: () => void;
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ handleBooking }) => {
  return (
    <section id="bookings" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-brand-slate-deep to-brand-slate-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
           <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-10 text-white leading-none">
             RESERVE
           </h2>
           <div className="relative -mt-6 md:-mt-16 z-10">
             <p className="text-3xl md:text-5xl font-elegant italic text-white mb-2">Secure your spot</p>
             <p className="text-brand-orange font-mono uppercase tracking-widest text-sm md:text-base">
               Choose your experience
             </p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {[
            { 
              name: 'Standard Booking', 
              subtitle: 'Main Bar & Garden',
              price: 'Book Free', 
              color: 'cyan', 
              accent: 'bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-500', 
              desc: 'Soak up the vibe in our main bar or heated garden marquee. Casual, lively, and perfect for getting together.',
              features: [
                { icon: Users, text: 'Groups of 2 - Large Parties' },
                { icon: Utensils, text: 'Full Menu Available' },
              ]
            },
            {
              name: 'Group Buffet',
              subtitle: 'Large Group Sharing',
              price: 'From £25pp',
              color: 'purple',
              accent: 'bg-purple-500/5 border-purple-500/30 hover:border-purple-500',
              desc: 'Designed for groups of 15+. A curated selection of dishes placed on tables for your group to enjoy. Pre-order required.',
              features: [
                { icon: Users, text: 'Groups 15+' },
                { icon: Utensils, text: 'Buffet Platter Service' },
                { icon: Clock, text: 'Pre-order Required' }
              ]
            },
            { 
              name: 'The VIP Hut', 
              subtitle: 'Celebration Central',
              price: 'Book Now', 
              color: 'gold', 
              accent: 'bg-gradient-to-br from-brand-orange to-black border-brand-orange hover:border-brand-orange shadow-[0_0_30px_rgba(247,142,44,0.1)]', 
              desc: 'The best seat in the house. Located centrally in our heated marquee. Perfect for birthdays and those who want to be seen.',
              features: [
                { icon: Crown, text: 'Center of Action' },
                { icon: Flame, text: 'Heated & Covered' },
                { icon: PartyPopper, text: 'Perfect for Birthdays' }
              ]
            },
            { 
              name: 'The Luxe Lounge', 
              subtitle: 'Ultra Exclusive',
              price: 'Private Hire', 
              color: 'pink', 
              accent: 'bg-red-500/5 border-red-500/30 hover:border-red-500', 
              desc: 'Your private sanctuary. Host up to 25 guests in our most exclusive hidden area. Perfect for private parties.',
              features: [
                { icon: Users, text: 'Up to 25 Guests' },
                { icon: Star, text: 'Private Area' },
                { icon: Wine, text: 'Bottle Service Avail.' }
              ]
            },
          ].map((ticket, i) => {
            return (
              <motion.div
                key={i}
                whileHover={{ y: -15 }}
                className={`relative p-8 md:p-10 border backdrop-blur-md flex flex-col min-h-[500px] transition-all duration-300 ${ticket.accent} rounded-2xl group`}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                     <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">{ticket.name}</h3>
                     {ticket.color === 'gold' && <Crown className="text-brand-orange w-6 h-6 animate-pulse" />}
                  </div>
                  <p className={`text-sm font-elegant italic mb-6 ${ticket.color === 'gold' ? 'text-brand-orange' : ticket.color === 'pink' ? 'text-red-500' : ticket.color === 'purple' ? 'text-purple-500' : 'text-cyan-500'}`}>
                    {ticket.subtitle}
                  </p>
                  
                  <p className="text-gray-200 mb-8 leading-relaxed font-light text-base">{ticket.desc}</p>
                  
                  <div className="h-px w-full bg-white/10 mb-8" />

                  <ul className="space-y-4 text-sm text-gray-200 font-light">
                    {ticket.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-white/5`}>
                           <feature.icon className={`w-4 h-4 ${ticket.color === 'gold' ? 'text-brand-orange' : ticket.color === 'pink' ? 'text-red-500' : ticket.color === 'purple' ? 'text-purple-500' : 'text-cyan-500'}`} /> 
                        </div>
                        <span className="font-normal">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={handleBooking}
                  className={`w-full py-4 text-sm font-semibold tracking-wide border transition-all duration-300 mt-8 rounded-xl
                    ${ticket.color === 'gold' ? 'bg-brand-orange text-black border-brand-orange hover:bg-white hover:border-white' : 'border-white/20 text-white hover:bg-white hover:text-black'}
                  `}
                >
                  {ticket.price}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BookingsSection;

