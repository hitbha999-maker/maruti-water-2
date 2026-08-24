import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import VariantSelector from './VariantSelector'
import { priceLabel } from '../lib/format'
import { useStore } from '../lib/store'
import { ArrowRight, Bag, Check, Scale } from './Icons'

const OUT_MS = 130 // old content leaves, then the new content animates in

/** The one line of hard fact worth putting on a card, per section. */
function keyFact(p) {
  const cap = p.specs['Purification Capacity']
  const store = p.specs['Storage Capacity']
  const body = p.specs['Body Materials'] || p.specs.Cabinet
  if (p.section === 'domestic') return [store && `${store} storage`, body].filter(Boolean).join(' · ')
  return [cap && `${cap} / hr`, body].filter(Boolean).join(' · ')
}

const stageList = (p) => (p.cartridges.length ? p.cartridges : p.components)

/**
 * One card per physical model. Where the catalogue lists several grades of the
 * same unit, they become variants inside this card instead of repeat cards.
 * Enquiry, compare and the product link all follow the selected grade.
 *
 * The selection is held as a product id, not an index. Two ids are tracked:
 * `selectedId` moves the moment the user acts, so the pill and aria-selected
 * never lag; `shownId` follows OUT_MS later, once the old content has faded.
 * Ids rather than indices mean a filter that drops a grade mid-animation can
 * never land the card on something the user did not pick.
 */
export default function ProductCard({ group }) {
  const { add, compare, toggleCompare } = useStore()
  const variants = group.variants
  const firstId = variants[0].product.id

  const [selectedId, setSelectedId] = useState(firstId)
  const [shownId, setShownId] = useState(firstId)
  const [dir, setDir] = useState(1)
  const timer = useRef(null)
  const touchX = useRef(null)

  const ids = variants.map((v) => v.product.id).join(',')
  const has = (id) => variants.some((v) => v.product.id === id)
  const indexOf = (id) => {
    const i = variants.findIndex((v) => v.product.id === id)
    return i < 0 ? 0 : i
  }

  // A Shop filter can drop the selected grade. Fall back to the first one,
  // during render so the card never paints a selection it no longer has.
  if (!has(selectedId) || !has(shownId)) {
    if (selectedId !== firstId) setSelectedId(firstId)
    if (shownId !== firstId) setShownId(firstId)
  }

  // Cancels an in-flight swap when the variant list changes, and on unmount.
  useEffect(() => () => clearTimeout(timer.current), [ids])

  const selectedIdx = indexOf(selectedId)
  const shownIdx = indexOf(shownId)
  const p = variants[shownIdx].product
  const leaving = selectedId !== shownId

  const select = (i) => {
    if (i < 0 || i >= variants.length) return
    const id = variants[i].product.id
    if (id === selectedId) return // already chosen: never restart the animation
    setDir(i > selectedIdx ? 1 : -1)
    setSelectedId(id)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShownId(id), OUT_MS)
  }

  const inCompare = compare.includes(p.id)
  const stages = stageList(p)
  const swapClass = leaving ? 'variant-out' : 'variant-swap'
  const swapKey = leaving ? 'out' : p.id
  // Several single-grade models share a name ("15 LPH Online RO" comes in two
  // builds), so accessible names carry the variant to tell them apart.
  const fullName = `${p.name}${p.variant ? ` — ${p.variant}` : ''}`

  return (
    <article
      className="card group"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null || variants.length < 2) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 44) select(dx < 0 ? selectedIdx + 1 : selectedIdx - 1)
      }}
    >
      {/* Focusable order skips this: the heading link below goes to the same
          place, so keyboard users get one stop per card, not two. */}
      <Link to={`/p/${p.slug}`} className="relative block overflow-hidden" tabIndex={-1}>
        {/* One image for the whole family — the grade never changes the body. */}
        <ProductImage
          product={{ ...p, name: group.name }}
          className="aspect-square"
          imgClassName="transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          <span className="chip border-transparent bg-ink text-white">{group.sectionLabel}</span>
          {!group.isFamily && p.variant && <span className="chip text-blue-ink">{p.variant}</span>}
        </div>
      </Link>

      <button
        onClick={() => toggleCompare(p.id)}
        aria-pressed={inCompare}
        aria-label={`${inCompare ? 'Remove' : 'Add'} ${fullName} ${inCompare ? 'from' : 'to'} compare`}
        className={`absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
          inCompare
            ? 'border-transparent bg-blue text-white'
            : 'border-line bg-white/85 text-muted hover:border-ink hover:text-ink'
        }`}
        title={inCompare ? 'Remove from compare' : 'Add to compare'}
      >
        {inCompare ? <Check size={16} /> : <Scale size={16} />}
      </button>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-[19px] leading-tight font-semibold">
          <Link to={`/p/${p.slug}`} className="link-underline" aria-label={`View ${fullName}`}>
            {group.name}
          </Link>
        </h3>

        <VariantSelector group={group} active={selectedIdx} onChange={select} className="mt-3" />

        {/* Everything below changes with the grade. Both blocks share a key so
            they animate as one. The 106px floor clears the tallest grade (two
            rows of filter chips) at every breakpoint, so switching grade never
            resizes the card. */}
        <div
          id={`${group.id}-panel`}
          role="region"
          aria-labelledby={group.isFamily ? `${group.id}-tab-${selectedIdx}` : undefined}
          className="min-h-[106px]"
        >
          <div key={`a-${swapKey}`} className={swapClass} data-dir={dir}>
            <p className="mt-3 text-[13.5px] text-muted">
              {p.configuration || 'Reverse osmosis system'}
            </p>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {stages.slice(0, 3).map((s) => (
                <li key={s} className="chip bg-mist py-1 text-[11.5px] text-muted">
                  {s.length > 26 ? `${s.slice(0, 24)}…` : s}
                </li>
              ))}
              {stages.length > 3 && (
                <li className="chip bg-mist py-1 text-[11.5px] text-muted">+{stages.length - 3}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div key={`b-${swapKey}`} className={swapClass} data-dir={dir}>
            <div className="font-display text-[22px] font-bold tracking-[-0.02em]">
              {priceLabel(p.price)}
            </div>
            <p className="mt-0.5 text-[12.5px] text-muted">
              {p.price ? 'M.R.P. incl. of taxes' : 'Ask us for the current rate'} · {keyFact(p)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => add(p.id)}
            aria-label={`Add ${fullName} to enquiry`}
            className="btn-dark btn-sm flex-1"
          >
            <Bag size={16} /> Add to enquiry
          </button>
          <Link
            to={`/p/${p.slug}`}
            className="btn-ghost btn-sm grid aspect-square place-items-center !px-0"
            aria-label={`View ${fullName}`}
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
