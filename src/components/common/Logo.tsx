import React from 'react';

interface LogoProps {
  size?: number;
  inverted?: boolean; // white bg, black K
}

export const Logo: React.FC<LogoProps> = ({ size = 36, inverted = false }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" fill={inverted ? '#ffffff' : '#000000'} />
    <path
      d="M10 8 L10 28 M10 18 L20 8 M10 18 L22 28"
      stroke={inverted ? '#000000' : '#ffffff'}
      strokeWidth="3.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
);
