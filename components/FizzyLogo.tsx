/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface FizzyLogoProps {
  className?: string;
  onClick?: () => void;
  // Kept for prop compatibility
  width?: number | string;
  height?: number | string;
  color?: string;
}

export default function FizzyLogo({ 
  className = "", 
  onClick
}: FizzyLogoProps) {
  
  return (
    <img 
      src="/images/logo/fizzy_moon_white_final.png" 
      alt="Fizzy Moon Logo"
      className={className}
      onClick={onClick}
      loading="eager"
      decoding="async"
    />
  );
}