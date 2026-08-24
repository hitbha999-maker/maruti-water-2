import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { useStore } from '../lib/store'
import ProductImage from '../components/ProductImage'
import { priceLabel } from '../lib/format'
import { ArrowRight, Check, Close, Plus, Scale } from '../components/Icons'

const spec = (p, key) => p.specs[key] || '—'

const ROWS = [
  { label: 'Price (M.R.P.)', get: (p) => priceLabel(p.price), strong: true },
  { label: 'Range', get: (p) => p.sectionLabel },
  { label: 'Configuration', get: (p) => p.configuration || '—' },
  { label: 'Purification capacity', get: (p) => spec(p, 'Purification Capacity') },
  { label: 'Storage capacity', get: (p) => spec(p, 'Storage Capacity') },
  { label: 'Body / cabinet', get: (p) => p.specs['Body Materials'] || p.specs.Cabinet || '—' },
  { label: 'Pressure tank', get: (p) => spec(p, 'Pressure Tank') },
  { label: 'Installation', get: (p) => spec(p, 'Installation') },
  { label: 'Power consumption', get: (p) => spec(p, 'Consumption') },
  { label: 'Weight', get: (p) => spec(p, 'Weight') },
  { label: 'Operating voltage', get: (p) => spec(p, 'Operating Voltage') },
  {
    label: 'Filters / components',
    get: (p) => {
      const list = p.cartridges.length ? p.cartridges : p.components
      return (
        <span className="flex flex-wrap gap-1.5">
          {list.slice(0, 6).map((t) => (
            <span key={t} className="chip bg-mist py-1 text-[11.5px] text-muted">
              {t.length > 24 ? `${t.slice(0, 22)}…` : t}
            </span>
          ))}
          {list.length > 6 && (
            <span className="chip bg-mist py-1 text-[11.5px] text-muted">+{list.length - 6}</span>
          )}
        </span>
      )
    },
  },
  { label: 'Catalogue page', get: (p) => `Page ${p.sourcePage}` },
]

export default function Compare() {
  const { compare, toggleCompare, clearCompare, add } = useStore()
  const picked = compare.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <>
      <section className="shell pt-10 pb-8 md:pt-14">
        <p className="eyebrow text-muted-2">Compare</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="display-2">Side by side.</h1>
            <p className="lede mt-4">
              Up to three models at once, on the figures printed in the catalogue — capacity, body,
              power and what is actually inside the housing.
            </p>
          </div>
          {picked.length > 0 && (
            <button onClick={clearCompare} className="btn-ghost btn-sm shrink-0">
              Clear all
            </button>
          )}
        </div>
      </section>

      {picked.length === 0 ? (
        <section className="shell pb-20">
          <div className="rounded-4xl border border-dashed border-line px-6 py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mist text-muted">
              <Scale size={24} />
            </span>
            <h2 className="mt-5 font-display text-[24px] font-semibold">Pick two or three models</h2>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
              Tap the compare icon on any product card, or start from one of these.
            </p>
          </div>

          <h3 className="eyebrow mt-12 mb-5 text-muted-2">One from each range</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['zuric-platinum', 'nine-gold', 'online-50-ss', 'plant-250']
              .map((s) => products.find((p) => p.slug === s))
              .filter(Boolean)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleCompare(p.id)}
                  className="card group items-start p-4 text-left"
                >
                  <ProductImage product={p} className="aspect-[4/3] w-full rounded-2xl" />
                  <span className="mt-4 block font-display text-[16px] font-semibold">{p.name}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">{priceLabel(p.price)}</span>
                  <span className="btn-ghost btn-sm mt-4">
                    <Plus size={15} /> Add to compare
                  </span>
                </button>
              ))}
          </div>
        </section>
      ) : (
        <section className="shell pb-20">
          <div className="overflow-x-auto rounded-4xl border border-line">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-[210px] border-b border-line bg-mist px-6 py-5 align-bottom font-display text-[13px] font-semibold tracking-[0.1em] text-muted-2 uppercase">
                    Model
                  </th>
                  {picked.map((p) => (
                    <th key={p.id} className="border-b border-line bg-mist px-6 py-5 align-bottom">
                      <div className="relative">
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="absolute -top-1 right-0 grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                          aria-label={`Remove ${p.name}`}
                        >
                          <Close size={15} />
                        </button>
                        <ProductImage product={p} className="h-28 w-28 rounded-2xl" sizes="112px" />
                        <Link
                          to={`/p/${p.slug}`}
                          className="mt-3 block font-display text-[17px] font-semibold hover:underline"
                        >
                          {p.name}
                        </Link>
                        <span className="block text-[13px] text-muted">
                          {p.variant || p.configuration}
                        </span>
                      </div>
                    </th>
                  ))}
                  {picked.length < 3 && (
                    <th className="border-b border-line bg-mist px-6 py-5 align-bottom">
                      <Link
                        to="/shop"
                        className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <Plus size={20} />
                        <span className="text-[12.5px]">Add another</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <th
                      scope="row"
                      className="px-6 py-4 text-left align-top font-display text-[13.5px] font-semibold text-muted"
                    >
                      {row.label}
                    </th>
                    {picked.map((p) => (
                      <td
                        key={p.id}
                        className={`px-6 py-4 align-top text-[14.5px] ${
                          row.strong ? 'font-display text-[19px] font-bold' : ''
                        }`}
                      >
                        {row.get(p)}
                      </td>
                    ))}
                    {picked.length < 3 && <td className="px-6 py-4" />}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="px-6 py-6 text-left" />
                  {picked.map((p) => (
                    <td key={p.id} className="px-6 py-6 align-top">
                      <button onClick={() => add(p.id)} className="btn-dark btn-sm w-full">
                        Add to enquiry
                      </button>
                      <Link to={`/p/${p.slug}`} className="btn-ghost btn-sm mt-2 w-full">
                        Details <ArrowRight size={15} />
                      </Link>
                    </td>
                  ))}
                  {picked.length < 3 && <td className="px-6 py-6" />}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-mist p-5 text-[13.5px] leading-relaxed text-muted">
            <Check size={17} className="mt-0.5 shrink-0 text-blue" />
            Figures are as printed in the V-Tech Aqua 2023 catalogue. If two models both clear your
            daily requirement, choose on body material and where it has to fit — not on the number of
            stages.
          </div>
        </section>
      )}
    </>
  )
}
