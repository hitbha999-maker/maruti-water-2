import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, RANGES, accessories } from '../data/accessories'
import { company } from '../data/products'
import { whatsappLink } from '../lib/format'
import AccessoryCard from '../components/AccessoryCard'
import { ArrowRight, Phone, Search } from '../components/Icons'

export default function Accessories() {
  const [cat, setCat] = useState('all')
  const [range, setRange] = useState('all')
  const [q, setQ] = useState('')

  /* Only categories that actually hold a part are offered. */
  const cats = useMemo(
    () => CATEGORIES.filter((c) => accessories.some((a) => a.category === c.id)),
    [],
  )

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return accessories.filter((a) => {
      if (cat !== 'all' && a.category !== cat) return false
      if (range !== 'all' && !a.sections.includes(range)) return false
      if (!term) return true
      return `${a.name} ${a.catalogueName} ${a.description}`.toLowerCase().includes(term)
    })
  }, [cat, range, q])

  const active = cats.find((c) => c.id === cat)
  const primary = company.contacts[0]

  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="shell py-14 md:py-20">
          <p className="eyebrow text-muted-2">Accessories &amp; spares</p>
          <h1 className="display-1 mt-4 max-w-3xl">Cartridges, membranes and parts</h1>
          <p className="lede mt-5 max-w-2xl">
            Every component listed on the systems we supply — filters, membranes, housings,
            pumps, controls and fittings. Tell us the model you run and we will quote the
            right part for it.
          </p>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <Chip active={cat === 'all'} onClick={() => setCat('all')}>
              All parts
            </Chip>
            {cats.map((c) => (
              <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label}
              </Chip>
            ))}
          </div>

          <label className="relative w-full shrink-0 lg:w-72">
            <span className="sr-only">Search parts</span>
            <Search
              size={17}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-2"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search parts"
              className="field w-full !pl-11"
            />
          </label>
        </div>

        {active?.blurb && (
          <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-muted">{active.blurb}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[13.5px] text-muted-2">
            {list.length} {list.length === 1 ? 'part' : 'parts'}
            {cat !== 'all' && ` in ${active?.label.toLowerCase()}`}
          </span>
          <span className="hidden h-3.5 w-px bg-line sm:block" />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[13px] text-muted-2">Range</span>
            <RangeButton active={range === 'all'} onClick={() => setRange('all')}>
              Any
            </RangeButton>
            {RANGES.map((r) => (
              <RangeButton
                key={r.id}
                active={range === r.id}
                onClick={() => setRange(r.id)}
              >
                {r.label}
              </RangeButton>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-12 rounded-4xl border border-line bg-sand p-10 text-center">
            <p className="font-display text-[19px] font-semibold">Nothing matches that</p>
            {/* An invitation, not an inventory claim — the catalogue records which
                parts exist, never what is on the shelf. */}
            <p className="mx-auto mt-2.5 max-w-md text-[14.5px] leading-relaxed text-muted">
              This list covers the parts the catalogue names. Send us the part name, or a
              photo of the old one, and we will try to identify and source it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <button
                onClick={() => {
                  setQ('')
                  setCat('all')
                  setRange('all')
                }}
                className="btn-dark btn-sm"
              >
                Clear filters
              </button>
              <a
                href={whatsappLink(
                  primary.phone,
                  'Hello Maruti Water Solution, I am looking for a spare part.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost btn-sm"
              >
                <Phone size={15} /> Ask on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((a) => (
              <li key={a.id} className="reveal">
                <AccessoryCard accessory={a} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-line bg-sand">
        <div className="shell flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="display-3">Not sure when yours is due?</h2>
            {/* The schedule takes an installation date and prints the usual
                intervals — it does not read capacity or feed water, so the copy
                must not promise that it does. */}
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Enter your installation date on the support page and it maps out the usual
              replacement intervals for each cartridge.
            </p>
          </div>
          <Link to="/support" className="btn-primary shrink-0">
            Open the schedule <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  )
}

function RangeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-2.5 py-1 font-display text-[12.5px] font-semibold transition-colors ${
        active ? 'bg-blue-wash text-blue-ink' : 'text-muted hover:bg-mist hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`chip shrink-0 whitespace-nowrap transition-colors ${
        active
          ? 'border-transparent bg-white text-black'
          : 'border-line bg-white/5 text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
