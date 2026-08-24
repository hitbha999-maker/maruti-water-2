import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Chevron } from './Icons'

export function SectionHead({ eyebrow, title, sub, action, actionTo, invert = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={`eyebrow ${invert ? 'text-white/45' : 'text-muted-2'}`}>{eyebrow}</p>
        )}
        <h2 className={`display-2 mt-4 ${invert ? 'text-white' : ''}`}>{title}</h2>
        {sub && (
          <p className={`lede mt-5 max-w-xl ${invert ? '!text-white/60' : ''}`}>{sub}</p>
        )}
      </div>
      {action && (
        <Link to={actionTo} className={invert ? 'btn-ghost-invert shrink-0' : 'btn-ghost shrink-0'}>
          {action} <ArrowRight size={17} />
        </Link>
      )}
    </div>
  )
}

export function Accordion({ items, invert = false }) {
  const [open, setOpen] = useState(0)
  return (
    <div className={`divide-y ${invert ? 'divide-white/12' : 'divide-line'}`}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={`font-display text-[17px] leading-snug font-semibold md:text-[19px] ${
                    invert ? 'text-white' : ''
                  }`}
                >
                  {it.q}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-400 ${
                    isOpen
                      ? invert
                        ? 'rotate-180 border-white bg-white text-ink'
                        : 'rotate-180 border-ink bg-ink text-white'
                      : invert
                        ? 'border-white/25 text-white/70'
                        : 'border-line text-muted'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
                >
                  <Chevron size={17} />
                </span>
              </button>
            </h3>
            <div
              className="grid transition-all duration-500"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transitionTimingFunction: 'var(--ease-out-quint)',
              }}
            >
              <div
                className="overflow-hidden"
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                aria-hidden={!isOpen}
                inert={!isOpen || undefined}
              >
                <p
                  className={`max-w-2xl pr-12 pb-6 text-[14.5px] leading-relaxed ${
                    invert ? 'text-white/60' : 'text-muted'
                  }`}
                >
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Marquee({ items, invert = false }) {
  const row = [...items, ...items]
  return (
    <div className="mask-fade-x overflow-hidden">
      <div className="flex w-max animate-marquee gap-14 md:gap-20">
        {row.map((t, i) => (
          <span
            key={i}
            className={`font-display text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap ${
              invert ? 'text-white/45' : 'text-muted-2'
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function StatBlock({ value, label, sub, invert = false, size = 'lg' }) {
  const scale =
    size === 'md'
      ? 'text-[clamp(1.5rem,2.2vw,2.125rem)]'
      : 'text-[clamp(2.25rem,4vw,3.5rem)]'
  return (
    <div>
      <div
        className={`font-display ${scale} leading-none font-bold tracking-[-0.035em] ${
          invert ? 'text-white' : ''
        }`}
      >
        {value}
      </div>
      <div className={`mt-3 font-display text-[15px] font-semibold ${invert ? 'text-white' : ''}`}>
        {label}
      </div>
      {sub && (
        <p className={`mt-1.5 text-[13.5px] leading-relaxed ${invert ? 'text-white/50' : 'text-muted'}`}>
          {sub}
        </p>
      )}
    </div>
  )
}

export function Pill({ children, tone = 'default' }) {
  const tones = {
    default: 'border-line bg-white text-ink',
    blue: 'border-transparent bg-blue-wash text-blue',
    dark: 'border-transparent bg-ink text-white',
    ghost: 'border-white/20 bg-white/5 text-white',
  }
  return <span className={`chip ${tones[tone]}`}>{children}</span>
}
