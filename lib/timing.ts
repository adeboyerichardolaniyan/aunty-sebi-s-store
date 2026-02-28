export const TIMING = {
  instant: 100,
  fast: 200,
  default: 400,
  medium: 600,
  slow: 800,
  cinematic: 1200,
  journey: 2000,
  epic: 3000,
} as const;

export const EASING = {
  ui: [0.4, 0, 0.2, 1] as const,
  uiCss: "cubic-bezier(0.4, 0, 0.2, 1)",

  camera: [0.25, 0.1, 0.25, 1] as const,
  cameraCss: "cubic-bezier(0.25, 0.1, 0.25, 1)",

  gentle: [0.25, 0.46, 0.45, 0.94] as const,
  gentleCss: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",

  bounce: [0.34, 1.56, 0.64, 1] as const,
  bounceCss: "cubic-bezier(0.34, 1.56, 0.64, 1)",

  spring: { mass: 1, tension: 180, friction: 26 },
  springHeavy: { mass: 2, tension: 120, friction: 30 },
} as const;

export const STAGGER = {
  items: 100,
  sections: 200,
  maxDelay: 500,
} as const;
