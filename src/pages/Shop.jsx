import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { capacityLph, products, sections } from '../data/products'
import ProductCard from './../components/ProductCard'
import { Pill } from '../components/ui'
import { ArrowRight, Close, Scale, Sparkle } from '../components/Icons'
import { useStore } from '../lib/store'
import { inr } from '../lib/format'

const CATEGORIES = [{ id: 'all', label: 'Everything' }, ...sections.map((s) => ({ id: s.id, label: s.label }))]

const TECH = ['RO', 'UV', 'UF', 'TDS', 'Alkaline']

const BODIES = [
  { id: 'abs', label: 'ABS cabinet', match: /ABS/i },
  { id: 'mspc', label: 'MSPC', match: /MSPC/i },
  { id: 'ss', label: 'Stainless steel', match: /Stainless/i },
]

const SORTS = [
  { id: 'featured', label: 'Catalogue order' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'cap-asc', label: 'Capacity: low to high' },
  { id: 'cap-desc', label: 'Capacity: high to low' },
]

const PRICE_MAX = 500000

function hasTech(p, t) {
  const hay = `${p.configuration} ${p.cartridges.join(' ')} ${p.components.join(' ')}`
  if (t === 'RO') return /\bRO\b|MEMBRANE/i.test(hay)
  if (t === 'UV') return /\bUV\b/i.test(hay)
  if (t === 'UF') return /\bUF\b/i.test(hay)
  if (t === 'TDS') return /TDS/i.test(hay)
  if (t === 'Alkaline') return /ALKALINE/i.test(hay)
  return false
}

function bodyOf(p) {
  return p.specs['Body Materials'] || p.specs.Cabinet || ''
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState(params.get('c') ?? 'all')
  const [tech, setTech] = useState([])
  const [body, setBody] = useState(null)
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [sort, setSort] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { compare } = useStore()

  useEffect(() => {
    const c = params.get('c')
    setCat(c ?? 'all')
  }, [params])

  const setCategory = (id) => {
    setCat(id)
    setParams(id === 'all' ? {} : { c: id }, { replace: true })
  }

  const toggleTech = (t) => setTech((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))

  const list = useMemo(() => {
    let base = cat === 'all' ? products : products.filter((p) => p.section === cat)

    // Models without a printed rate always stay visible — filtering them out by
    // price would hide real products behind a number the catalogue never gave.
    if (maxPrice < PRICE_MAX) base = base.filter((p) => p.price == null || p.price <= maxPrice)
    if (tech.length) base = base.filter((p) => tech.every((t) => hasTech(p, t)))
    if (body) base = base.filter((p) => BODIES.find((b) => b.id === body).match.test(bodyOf(p)))

    const sorted = [...base]
    const price = (p) => (typeof p.price === 'number' ? p.price : Number.POSITIVE_INFINITY)
    if (sort === 'price-asc') sorted.sort((a, b) => price(a) - price(b))
    if (sort === 'price-desc') sorted.sort((a, b) => price(b) - price(a))
    if (sort === 'cap-asc') sorted.sort((a, b) => capacityLph(a) - capacityLph(b))
    if (sort === 'cap-desc') sorted.sort((a, b) => capacityLph(b) - capacityLph(a))
    return sorted
  }, [cat, tech, body, maxPrice, sort])

  const activeCount = tech.length + (body ? 1 : 0) + (maxPrice < PRICE_MAX ? 1 : 0)
  const clearAll = () => {
    setTech([])
    setBody(null)
    setMaxPrice(PRICE_MAX)
  }

  const section = sections.find((s) => s.id === cat)

  const Filters = (
    <div className="space-y-9">
      <div>
        <h3 className="eyebrow mb-4 text-muted-2">Range</h3>
        <ul className="space-y-1">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setCategory(c.id)}
                aria-current={cat === c.id ? 'true' : undefined}
                className={`w-full rounded-xl px-3 py-2 text-left font-display text-[14.5px] transition-colors ${
                  cat === c.id ? 'bg-ink font-semibold text-white' : 'text-muted hover:bg-mist hover:text-ink'
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow mb-4 text-muted-2">Purification</h3>
        <div className="flex flex-wrap gap-2">
          {TECH.map((t) => (
            <button
              key={t}
              onClick={() => toggleTech(t)}
              aria-pressed={tech.includes(t)}
              className={`chip transition-colors ${
                tech.includes(t) ? 'border-transparent bg-blue text-white' : 'text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="eyebrow mb-4 text-muted-2">Body material</h3>
        <div className="flex flex-wrap gap-2">
          {BODIES.map((b) => (
            <button
              key={b.id}
              onClick={() => setBody(body === b.id ? null : b.id)}
              aria-pressed={body === b.id}
              className={`chip transition-colors ${
                body === b.id ? 'border-transparent bg-ink text-white' : 'text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="eyebrow mb-4 text-muted-2">Budget</h3>
        <div className="rounded-2xl border border-line p-4">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[20px] font-bold">
              {maxPrice >= PRICE_MAX ? 'Any' : inr(maxPrice)}
            </span>
            <span className="text-[12.5px] text-muted-2">
              {maxPrice >= PRICE_MAX ? 'budget' : 'and under'}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max={PRICE_MAX}
            step="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(+e.target.value)}
            aria-label="Maximum price"
            className="mt-4 w-full accent-blue"
          />
        </div>
      </div>

      <div className="rounded-3xl ink-field p-5 text-white">
        <p className="font-display text-[16px] leading-snug font-semibold">
          Not sure which capacity?
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          Tell us litres per day and where it is going. We will shortlist three.
        </p>
        <Link to="/#finder" className="btn-ghost-invert btn-sm mt-4">
          <Sparkle size={15} /> Requirement finder
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <section className="shell pt-10 pb-8 md:pt-14">
        <p className="eyebrow text-muted-2">{section ? section.pages : 'Full range · 30 models'}</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="display-2">{section ? section.label : 'The complete range'}</h1>
            <p className="lede mt-4">
              {section
                ? section.blurb
                : 'Thirty models across three ranges, arranged exactly as they appear in the catalogue — domestic cabinets, commercial systems and industrial plants.'}
            </p>
          </div>
          {compare.length > 0 && (
            <Link to="/compare" className="btn-ghost shrink-0">
              <Scale size={17} /> Compare {compare.length}
            </Link>
          )}
        </div>
      </section>

      <section className="shell pb-20">
        <div className="grid gap-10 lg:grid-cols-[248px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-28">{Filters}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setFiltersOpen(true)} className="btn-ghost btn-sm lg:hidden">
                  Filters {activeCount > 0 && <span className="text-blue-ink">({activeCount})</span>}
                </button>
                <p className="text-[14px] text-muted">
                  <strong className="font-semibold text-ink">{list.length}</strong>{' '}
                  {list.length === 1 ? 'model' : 'models'}
                </p>
                {activeCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="hidden text-[13.5px] text-muted underline decoration-line underline-offset-4 hover:text-ink lg:inline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <label className="flex items-center gap-2 text-[14px] text-muted">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-line bg-white px-3.5 py-2 font-display text-[14px] font-medium text-ink"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {activeCount > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tech.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTech(t)}
                    aria-label={`Remove ${t} filter`}
                    className="chip bg-mist"
                  >
                    {t} <Close size={13} className="text-muted" aria-hidden="true" />
                  </button>
                ))}
                {body && (
                  <button
                    onClick={() => setBody(null)}
                    aria-label={`Remove ${BODIES.find((b) => b.id === body).label} filter`}
                    className="chip bg-mist"
                  >
                    {BODIES.find((b) => b.id === body).label}{' '}
                    <Close size={13} className="text-muted" aria-hidden="true" />
                  </button>
                )}
                {maxPrice < PRICE_MAX && (
                  <button
                    onClick={() => setMaxPrice(PRICE_MAX)}
                    aria-label="Remove budget filter"
                    className="chip bg-mist"
                  >
                    Under {inr(maxPrice)} <Close size={13} className="text-muted" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {list.length === 0 ? (
              <div className="mt-16 rounded-4xl border border-dashed border-line py-20 text-center">
                <p className="font-display text-[22px] font-semibold">Nothing matches that.</p>
                <p className="mx-auto mt-3 max-w-md text-[14.5px] text-muted">
                  Try loosening the purification filters — few models carry every stage at once.
                </p>
                <button onClick={clearAll} className="btn-dark btn-sm mt-6">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p, i) => (
                  <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}

            <div className="canvas mt-14 water-field p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-lg">
                  <Pill tone="blue">Not sure yet?</Pill>
                  <h2 className="display-3 mt-4">Tell us your daily requirement.</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
                    Litres per day, your feed water, and where the system is going. With those three
                    we can narrow thirty models down to one or two.
                  </p>
                </div>
                <Link to="/quote" className="btn-primary shrink-0">
                  Send us the details <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* mobile filter sheet */}
      <div
        className={`fixed inset-0 z-[65] lg:hidden ${filtersOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!filtersOpen}
        inert={!filtersOpen || undefined}
      >
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-400 ${
            filtersOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-4xl bg-white transition-transform duration-500 ${
            filtersOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
        >
          <div className="sticky top-0 flex items-center justify-between border-b border-line bg-white px-5 py-4">
            <h2 className="font-display text-[18px] font-semibold">Filters</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist"
              aria-label="Close filters"
            >
              <Close size={22} />
            </button>
          </div>
          <div className="p-5">{Filters}</div>
          <div className="sticky bottom-0 flex gap-3 border-t border-line bg-white p-5">
            <button onClick={clearAll} className="btn-ghost flex-1">
              Clear
            </button>
            <button onClick={() => setFiltersOpen(false)} className="btn-primary flex-1">
              Show {list.length}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
