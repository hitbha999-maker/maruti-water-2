import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { fitsProducts, rangeLabels } from '../data/accessories'
import {
  Bolt,
  Cartridge,
  Check,
  Gauge,
  Grains,
  Plus,
  Shield,
  Sparkle,
  Tube,
  Vessel,
  Wrench,
} from './Icons'

/**
 * Parts are named in the catalogue but never photographed in it, so a card
 * draws its category glyph rather than a stock image. Inventing product shots
 * for a real dealer's spare parts would be worse than showing none.
 */
const GLYPHS = {
  'filter-cartridges': Cartridge,
  'ro-membranes': Sparkle,
  pumps: Bolt,
  'controls-instrumentation': Gauge,
  'membrane-pressure-tubes': Tube,
  'filter-housings': Shield,
  'frp-vessels': Vessel,
  'filter-media': Grains,
  'valves-fittings': Wrench,
}

export function glyphFor(categoryId) {
  return GLYPHS[categoryId] || Wrench
}

export default function AccessoryCard({ accessory }) {
  const { add, lines } = useStore()
  const Glyph = glyphFor(accessory.category)

  const inList = lines.some((l) => l.id === accessory.id)
  const fits = fitsProducts(accessory)

  /* The compatibility line is derived from which catalogue models actually list
     this part — never hand-written. */
  const shown = fits.slice(0, 3)
  const more = fits.length - shown.length

  return (
    <article className="part-card card flex h-full flex-col p-5" id={accessory.id}>
      <div className="flex items-start gap-4">
        <div className="part-plate h-16 w-16 shrink-0 rounded-2xl">
          <Glyph size={26} className="part-glyph" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15.5px] leading-snug font-semibold">
            {accessory.name}
          </h3>
          {accessory.spec && (
            <p className="mt-1 font-display text-[12.5px] font-semibold text-blue-ink">
              {accessory.spec}
            </p>
          )}
          {/* A domestic sediment cartridge and a 20-inch jumbo are both "filter
              cartridges" — the range is what separates them at a glance. */}
          <span className="mt-1.5 flex flex-wrap gap-1">
            {rangeLabels(accessory).map((r) => (
              <span
                key={r}
                className="rounded-full bg-mist px-2 py-0.5 font-display text-[11px] font-semibold tracking-[0.02em] text-muted uppercase"
              >
                {r}
              </span>
            ))}
          </span>
        </div>
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{accessory.description}</p>

      {fits.length > 0 && (
        <div className="mt-4 border-t border-line pt-3.5">
          <p className="eyebrow text-muted-2">Fitted on</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            {shown.map((p, i) => (
              <span key={p.id}>
                {i > 0 && ', '}
                <Link
                  to={`/p/${p.slug}`}
                  className="link-underline font-medium text-ink"
                >
                  {p.name}
                </Link>
              </span>
            ))}
            {more > 0 && (
              <span className="text-muted-2">
                {' '}
                and {more} other {more === 1 ? 'model' : 'models'}
              </span>
            )}
          </p>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        {/* The catalogue prices complete systems, never individual parts — so
            there is no figure to print and none is invented. */}
        <span className="font-display text-[13.5px] font-semibold text-muted">
          Price on request
        </span>

        <button
          onClick={() => add(accessory.id)}
          className={inList ? 'btn-ghost btn-sm' : 'btn-dark btn-sm'}
          aria-label={`Add ${accessory.name} to your enquiry`}
        >
          {inList ? (
            <>
              <Check size={15} /> Added
            </>
          ) : (
            <>
              <Plus size={15} /> Enquire
            </>
          )}
        </button>
      </div>
    </article>
  )
}
