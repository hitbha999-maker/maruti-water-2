const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Svg = ({ children, size = 20, filled, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    {...(filled ? { fill: 'currentColor' } : base)}
    {...rest}
  >
    {children}
  </svg>
)

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)
export const ArrowUpRight = (p) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
)
export const Chevron = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
export const Bag = (p) => (
  <Svg {...p}>
    <path d="M6 7h12l-1 13H7L6 7Z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </Svg>
)
export const Close = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
export const Menu = (p) => (
  <Svg {...p}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </Svg>
)
export const Check = (p) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
)
export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const Minus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)
export const Search = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)
export const Star = ({ size = 16, ...p }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
    <path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 17l-5.6 3.2 1.3-6.3L3 9.6l6.3-.7L12 3Z" />
  </svg>
)
export const Droplet = (p) => (
  <Svg {...p}>
    <path d="M12 3.5c3.6 4.4 6 7.4 6 10.2a6 6 0 0 1-12 0c0-2.8 2.4-5.8 6-10.2Z" />
  </Svg>
)
export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 3l7 2.4v5.9c0 4.8-3 8-7 9.7-4-1.7-7-4.9-7-9.7V5.4L12 3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)
export const Leaf = (p) => (
  <Svg {...p}>
    <path d="M4 20c0-8 6-14 16-14 0 10-5 15-11 15-3 0-5-1-5-1Z" />
    <path d="M9 15c2-3 5-5 8-6" />
  </Svg>
)
export const Bolt = (p) => (
  <Svg {...p}>
    <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
  </Svg>
)
export const Wrench = (p) => (
  <Svg {...p}>
    <path d="M14.5 4.5a5 5 0 0 0 6 6l-9 9a3 3 0 1 1-4-4l9-9a5 5 0 0 0-2-2Z" />
  </Svg>
)
export const Phone = (p) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
  </Svg>
)
export const Truck = (p) => (
  <Svg {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17.5" cy="18" r="2" />
  </Svg>
)
export const Sparkle = (p) => (
  <Svg {...p}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    <path d="m6.5 6.5 3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" />
  </Svg>
)
export const Scale = (p) => (
  <Svg {...p}>
    <path d="M12 4v16M6 8h12M6 8 3 15h6L6 8ZM18 8l-3 7h6l-3-7Z" />
  </Svg>
)
export const Pin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)
export const Play = (p) => (
  <Svg {...p} filled>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </Svg>
)

/* Accessory category glyphs — the catalogue never photographs its parts, so a
   card is drawn rather than illustrated. */
export const Cartridge = (p) => (
  <Svg {...p}>
    <rect x="8" y="3" width="8" height="18" rx="2" />
    <path d="M10.5 7v10M13.5 7v10" />
  </Svg>
)
export const Tube = (p) => (
  <Svg {...p}>
    <path d="M6 7h12a3 5 0 0 1 0 10H6a3 5 0 0 1 0-10Z" />
    <path d="M6 7a3 5 0 0 0 0 10" />
  </Svg>
)
export const Vessel = (p) => (
  <Svg {...p}>
    <path d="M7 6.5v11c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-11" />
    <ellipse cx="12" cy="6.5" rx="5" ry="2.5" />
  </Svg>
)
export const Gauge = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 12l4-3.5" />
    <path d="M12 3.5v1.5M20.5 12H19M12 20.5V19M3.5 12H5" />
  </Svg>
)
export const Grains = (p) => (
  <Svg {...p}>
    <circle cx="8" cy="9" r="2.2" />
    <circle cx="15.5" cy="7.5" r="1.8" />
    <circle cx="12" cy="14.5" r="2.4" />
    <circle cx="17.5" cy="15" r="1.6" />
    <circle cx="6.5" cy="16" r="1.5" />
  </Svg>
)
