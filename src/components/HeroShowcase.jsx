import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroProducts } from '../data/heroShowcase'
import { priceLabel } from '../lib/format'
import { ArrowRight } from './Icons'

const AUTO_MS = 5200 // dwell time per product
const TRANS_MS = 820 // cross-fade duration

/** Long section names make a poor pill; "Commercial RO Plant" reads as "Commercial". */
const shortLabel = (label) => label.replace(/\s*RO Plant$/i, '')

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export default function HeroShowcase() {
  const slides = heroProducts
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [leaving, setLeaving] = useState(null) // { i, dir }
  const [paused, setPaused] = useState(false)
  const [cycle, setCycle] = useState(0) // restarts the dwell timer + progress bar together
  const reduced = usePrefersReducedMotion()
  const idxRef = useRef(0)
  const touchX = useRef(null)

  const go = useCallback(
    (delta) => {
      if (slides.length < 2) return
      const from = idxRef.current
      const to = (from + delta + slides.length) % slides.length
      if (to === from) return
      idxRef.current = to
      setDir(delta >= 0 ? 1 : -1)
      setLeaving({ i: from, dir: delta >= 0 ? 1 : -1 })
      setIndex(to)
      setCycle((c) => c + 1)
    },
    [slides.length],
  )

  // Retire the outgoing slide once its exit animation has finished.
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => setLeaving(null), TRANS_MS + 60)
    return () => clearTimeout(t)
  }, [leaving])

  // Auto-advance. Bumping `cycle` on resume restarts the timer and the
  // progress bar in step, so the bar never disagrees with the rotation.
  useEffect(() => {
    if (paused || slides.length < 2) return
    const t = setTimeout(() => go(1), AUTO_MS)
    return () => clearTimeout(t)
  }, [cycle, paused, go, slides.length])

  // Warm the next image so a transition never flashes an empty frame.
  useEffect(() => {
    if (slides.length < 2) return
    const next = slides[(index + 1) % slides.length].product
    const img = new Image()
    img.src = next.image
  }, [index, slides])

  const resume = () => {
    setPaused(false)
    setCycle((c) => c + 1)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  const stateOf = (i) => (i === index ? 'active' : leaving?.i === i ? 'leaving' : 'hidden')
  const dirOf = (i) => (i === index ? dir : leaving?.i === i ? leaving.dir : 1)

  const active = slides[index]

  if (!slides.length) return null

  return (
    <div
      className="group/hero mx-auto w-full max-w-[540px] select-none"
      style={{ '--hero-trans': `${TRANS_MS}ms`, '--hero-auto': `${AUTO_MS}ms` }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={resume}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={resume}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1)
      }}
    >
      {/* ---------- stage ---------- */}
      <div className="relative aspect-square">
        <div className="hero-stage absolute inset-0 overflow-hidden rounded-4xl bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_26px_60px_-38px_rgba(11,11,12,.45)] ring-1 ring-white/60">
          {slides.map(({ product, section }, i) => {
            const state = stateOf(i)
            return (
              <div key={product.id} className="hero-slide" data-state={state} data-dir={dirOf(i)}>
                {state !== 'hidden' && <span className="hero-glow" aria-hidden="true" />}

                <figure
                  className="hero-rise absolute inset-0 grid place-items-center"
                  style={{ animationDelay: '40ms' }}
                >
                  <div className="hero-float grid h-full w-full place-items-center">
                    <img
                      src={product.image}
                      alt={`${product.name}${product.variant ? ` — ${product.variant}` : ''}, ${section.label}`}
                      className="hero-shot"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 ? 'high' : 'auto'}
                      decoding="async"
                      draggable="false"
                    />
                  </div>
                </figure>

                {state === 'active' && (
                  <span
                    className="hero-rise absolute top-5 left-5 rounded-full border border-blue/15 bg-blue-wash/80 px-3 py-1 font-display text-[11px] font-semibold tracking-[0.14em] text-blue-ink uppercase backdrop-blur-sm"
                    style={{ animationDelay: '180ms' }}
                  >
                    {shortLabel(section.label)}
                  </span>
                )}
              </div>
            )
          })}

          <Link
            to={`/p/${active.product.slug}`}
            className="absolute inset-0 z-20"
            aria-label={`View ${active.product.name}`}
          />
        </div>

        {slides.length > 1 && (
          <>
            <ShowcaseArrow side="left" onClick={() => go(-1)} label="Previous product" />
            <ShowcaseArrow side="right" onClick={() => go(1)} label="Next product" />
          </>
        )}
      </div>

      {/* ---------- caption ---------- */}
      <div className="relative mt-3 min-h-[64px] text-center">
        {slides.map(({ product, section }, i) => {
          const state = stateOf(i)
          if (state === 'hidden') return null
          return (
            <div
              key={product.id}
              className="hero-slide"
              data-state={state}
              data-dir={dirOf(i)}
              style={{ position: state === 'active' ? 'relative' : 'absolute' }}
              aria-hidden={state !== 'active'}
            >
              <p
                className="hero-rise font-display text-[15px] font-semibold"
                style={{ animationDelay: '110ms' }}
              >
                {product.name}
                {product.variant && (
                  <span className="font-medium text-muted"> — {product.variant}</span>
                )}
              </p>
              <p
                className="hero-rise mt-1 text-[13.5px] text-muted"
                style={{ animationDelay: '210ms' }}
              >
                {product.price != null && <>{priceLabel(product.price)} · </>}
                {section.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* ---------- indicators ---------- */}
      {slides.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map(({ product }, i) => (
            <button
              key={product.id}
              onClick={() => go(i - index)}
              aria-label={`Show ${product.name}`}
              aria-current={i === index ? 'true' : undefined}
              className={`hero-bar ${i === index ? 'w-9' : 'w-3 hover:bg-ink/25'}`}
            >
              {i === index && (
                <span
                  key={cycle}
                  className="hero-bar-fill"
                  data-run={!paused && !reduced}
                  style={{ animationPlayState: paused ? 'paused' : 'running' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {`Slide ${index + 1} of ${slides.length}: ${active.product.name}, ${active.section.label}`}
      </p>
    </div>
  )
}

function ShowcaseArrow({ side, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/60 text-ink/60 opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-ink focus-visible:opacity-100 group-hover/hero:opacity-100 md:grid ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
      style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
    >
      <ArrowRight size={16} className={side === 'left' ? 'rotate-180' : ''} />
    </button>
  )
}
