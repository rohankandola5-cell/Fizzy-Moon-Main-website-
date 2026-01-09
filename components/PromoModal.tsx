/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { PromoConfig } from '../promoConfig';

interface PromoModalProps {
  config: PromoConfig;
  onClose?: () => void;
}

const PromoModal: React.FC<PromoModalProps> = ({ config, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show if disabled
    if (!config.enabled) {
      return;
    }

    // Show modal after delay (default 1500ms)
    const delay = config.delay ?? 1500;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [config]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleCTAClick = () => {
    if (config.ctaLink) {
      window.open(config.ctaLink, '_blank');
    }
  };

  if (!config.enabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div 
              className="relative max-w-2xl w-full pointer-events-auto"
              style={{ 
                backgroundColor: config.backgroundColor || 'rgb(21, 34, 46)', // brand-slate-dark
                aspectRatio: '210 / 297' // A4 ratio (approximately)
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-md"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Promotional Image */}
              {config.image && (
                <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                  <img
                    src={config.image}
                    alt={config.title || 'Promotional offer'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Optional Overlay Content */}
                  {(config.title || config.subtitle || config.ctaText) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                      {config.title && (
                        <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-2">
                          {config.title}
                        </h2>
                      )}
                      {config.subtitle && (
                        <p className="text-lg md:text-xl text-brand-orange font-medium mb-6">
                          {config.subtitle}
                        </p>
                      )}
                      {config.ctaText && (
                        <button
                          onClick={handleCTAClick}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-black font-bold font-heading uppercase tracking-widest text-sm rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(247,142,44,0.4)]"
                        >
                          {config.ctaText}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Text-only version (if no image) */}
              {!config.image && (config.title || config.subtitle) && (
                <div className="relative w-full h-full rounded-2xl border border-white/10 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-gradient-to-br from-brand-slate-dark to-brand-slate-deep shadow-2xl shadow-brand-orange/10">
                  {config.title && (
                    <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase text-white mb-4">
                      {config.title}
                    </h2>
                  )}
                  {config.subtitle && (
                    <p className="text-xl md:text-2xl text-brand-orange font-medium mb-8">
                      {config.subtitle}
                    </p>
                  )}
                  {config.ctaText && (
                    <button
                      onClick={handleCTAClick}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange text-black font-bold font-heading uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(247,142,44,0.4)]"
                    >
                      {config.ctaText}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;

