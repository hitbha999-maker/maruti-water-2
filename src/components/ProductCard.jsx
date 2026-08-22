import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import { priceLabel } from '../lib/format'
import { useStore } from '../lib/store'
import { ArrowRight, Bag, Check, Scale } from './Icons'

/** The one line of hard fact worth putting on a card, per section. */
function keyFact(p) {
  const cap = p.specs['Purification Capacity']
  const store = p.specs['Storage Capacity']
  const body = p.specs['Body Materials'] || p.specs.Cabinet
  if (p.section === 'domestic') return [store && `${store} storage`, body].filter(Boolean).join(' · ')
  return [cap && `${cap} / hr`, body].filter(Boolean).join(' · ')
}

export default function ProductCard({ p }) {
  const { add, compare, toggleCompare } = useStore()
  const inCompare = compare.includes(p.id)

  return (
    <article className="card group">
      <Link to={`/p/${p.slug}`} className="relative block overflow-hidden">
        <ProductImage
          product={p}
          className="aspect-square"
          imgClassName="transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          <span className="chip border-transparent bg-ink text-white">{p.sectionLabel}</span>
          {p.variant && <span className="chip text-blue-ink">{p.variant}</span>}
        </div>
      </Link>

      <button
        onClick={() => toggleCompare(p.id)}
        aria-pressed={inCompare}
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
          <Link to={`/p/${p.slug}`} className="link-underline">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1 text-[13.5px] text-muted">{p.configuration || 'Reverse osmosis system'}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {(p.cartridges.length ? p.cartridges : p.components).slice(0, 3).map((s) => (
            <li key={s} className="chip bg-mist py-1 text-[11.5px] text-muted">
              {s.length > 26 ? `${s.slice(0, 24)}…` : s}
            </li>
          ))}
          {(p.cartridges.length ? p.cartridges : p.components).length > 3 && (
            <li className="chip bg-mist py-1 text-[11.5px] text-muted">
              +{(p.cartridges.length ? p.cartridges : p.components).length - 3}
            </li>
          )}
        </ul>

        <div className="mt-auto pt-6">
          <div className="font-display text-[22px] font-bold tracking-[-0.02em]">
            {priceLabel(p.price)}
          </div>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {p.price ? 'M.R.P. incl. of taxes' : 'Ask us for the current rate'} · {keyFact(p)}
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => add(p.id)} className="btn-dark btn-sm flex-1">
            <Bag size={16} /> Add to enquiry
          </button>
          <Link
            to={`/p/${p.slug}`}
            className="btn-ghost btn-sm grid aspect-square place-items-center !px-0"
            aria-label={`View ${p.name}`}
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
