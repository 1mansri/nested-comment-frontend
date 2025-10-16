'use client';

import * as React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const SunIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    className={className}
  >
    <rect width="256" height="256" fill="none" />
    <line x1="128" y1="40" x2="128" y2="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <circle cx="128" cy="128" r="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" fill="none" />
    <line x1="64" y1="64" x2="48" y2="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <line x1="64" y1="192" x2="48" y2="208" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <line x1="192" y1="64" x2="208" y2="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <line x1="192" y1="192" x2="208" y2="208" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <line x1="40" y1="128" x2="16" y2="128" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <line x1="128" y1="216" x2="128" y2="240" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <line x1="216" y1="128" x2="240" y2="128" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    className={className}
  >
    <rect width="256" height="256" fill="none" />
    <path
      d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
      fill="none"
    />
  </svg>
);

export const GearSixIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    className={className}
  >
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Z" />
  </svg>
);
