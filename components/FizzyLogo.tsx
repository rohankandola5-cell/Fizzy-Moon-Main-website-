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
      src="https://github.com/rohankandola5-cell/Fizzy-Moon/blob/main/services/fizzy_moon_white_final.png?raw=true" 
      alt="Fizzy Moon Logo"
      className={className}
      onClick={onClick}
    />
  );
}