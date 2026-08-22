import { Link } from 'react-router-dom'

/**
 * The client's own logo artwork. Two lockups are shipped as WebP with alpha —
 * the brand blue original and a white knock-out for dark surfaces — plus the
 * MWS monogram on its own for tight spaces.
 *
 * Anything decorative is aria-hidden; the accessible name lives on the link.
 */

export function LogoMark({ className = '', invert = false, alt = '' }) {
  return (
    <img
      src={invert ? '/brand/mws-mark-white.webp' : '/brand/mws-mark.webp'}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      className={`object-contain ${className}`}
      draggable="false"
    />
  )
}

export function LogoLockup({ className = 'h-12', invert = false, alt = '' }) {
  return (
    <img
      src={invert ? '/brand/mws-logo-white.webp' : '/brand/mws-logo.webp'}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      className={`w-auto object-contain ${className}`}
      draggable="false"
    />
  )
}

/**
 * Header / footer logo. Renders the real artwork and carries the company name
 * as the link's accessible name, so the brand is still announced to screen
 * readers and indexed by search engines.
 */
export default function Logo({ to = '/', invert = false, size = 'h-12', className = '' }) {
  const Wrap = to ? Link : 'div'
  const wrapProps = to ? { to } : {}

  return (
    <Wrap
      {...wrapProps}
      className={`group inline-flex shrink-0 items-center ${className}`}
      aria-label="Maruti Water Solution — home"
    >
      <LogoLockup
        className={`${size} transition-transform duration-500 group-hover:scale-[1.03]`}
        invert={invert}
      />
    </Wrap>
  )
}
