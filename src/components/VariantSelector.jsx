import { useRef } from 'react'

/**
 * Segmented control for choosing a grade inside a product card.
 * A single pill slides behind the active tab rather than each button
 * repainting, which keeps the movement continuous.
 *
 * Follows the tablist pattern with automatic activation: the group is one tab
 * stop, arrows move within it, and focus travels with the selection so the
 * focused button is always the one carrying tabIndex 0.
 */
export default function VariantSelector({ group, active, onChange, className = '' }) {
  const railRef = useRef(null)
  const n = group.variants.length
  if (n < 2) return null

  const goTo = (next) => {
    onChange(next)
    railRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      goTo((active + 1) % n)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      goTo((active - 1 + n) % n)
    } else if (e.key === 'Home') {
      e.preventDefault()
      goTo(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      goTo(n - 1)
    }
  }

  return (
    <div
      ref={railRef}
      role="tablist"
      aria-label={`${group.name} variants`}
      className={`variant-rail ${className}`}
      onKeyDown={onKeyDown}
    >
      <span
        className="variant-thumb"
        style={{ width: `calc((100% - 6px) / ${n})`, transform: `translateX(${active * 100}%)` }}
        aria-hidden="true"
      />
      {group.variants.map((v, i) => (
        <button
          key={v.product.id}
          type="button"
          role="tab"
          id={`${group.id}-tab-${i}`}
          aria-selected={i === active}
          aria-controls={`${group.id}-panel`}
          // roving tabindex: the group is one tab stop, arrows move within it
          tabIndex={i === active ? 0 : -1}
          aria-label={`Select ${group.name} ${v.label}`}
          onClick={() => onChange(i)}
          className="variant-tab"
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}
