import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bySection, capacityLph, company, faqs, getProduct, sections } from '../data/products'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import { Accordion, Pill, SectionHead } from '../components/ui'
import { useStore } from '../lib/store'
import { priceLabel, whatsappLink } from '../lib/format'
import NotFound from './NotFound'
import {
  ArrowRight,
  Bag,
  Bolt,
  Check,
  Minus,
  Phone,
  Pin,
  Plus,
  Scale,
  Shield,
} from '../components/Icons'

export default function Product() {
  const { slug } = useParams()
  const p = getProduct(slug)
  const { add, compare, toggleCompare } = useStore()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('specs')

  const related = useMemo(
    () => (p ? bySection(p.section).filter((x) => x.id !== p.id).slice(0, 3) : []),
    [p],
  )

  if (!p) return <NotFound />

  const section = sections.find((s) => s.id === p.section)
  const lph = capacityLph(p)
  const primary = company.contacts[0]
  const stageList = p.cartridges.length ? p.cartridges : p.components

  return (
    <>
      <nav aria-label="Breadcrumb" className="shell pt-6">
        <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted">
          <li>
            <Link to="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to={`/shop?c=${p.section}`} className="hover:text-ink">
              {section.label}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-ink">{p.name}</li>
        </ol>
      </nav>

      {/* ---------- hero split ---------- */}
      <section className="shell grid gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="canvas relative aspect-square">
            <ProductImage
              product={p}
              className="absolute inset-0 h-full w-full"
              sizes="(max-width: 1024px) 92vw, 620px"
              priority
            />
            <span className="chip absolute top-5 left-5 border-transparent bg-ink text-white">
              {section.label}
            </span>
            <button
              onClick={() => toggleCompare(p.id)}
              className={`absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                compare.includes(p.id)
                  ? 'border-transparent bg-blue text-white'
                  : 'border-line bg-white/85 text-muted hover:border-ink hover:text-ink'
              }`}
              aria-pressed={compare.includes(p.id)}
              aria-label={`${compare.includes(p.id) ? 'Remove' : 'Add'} ${p.name} ${
                compare.includes(p.id) ? 'from' : 'to'
              } compare`}
            >
              {compare.includes(p.id) ? <Check size={17} /> : <Scale size={17} />}
            </button>
          </div>

          <p className="mt-4 text-[12.5px] leading-relaxed text-muted-2">
            Product photograph and specifications from the V-Tech Aqua 2023 catalogue, page{' '}
            {p.sourcePage}. Finish and fittings may vary between production batches.
          </p>
        </div>

        {/* buy panel */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {p.variant && <Pill tone="blue">{p.variant}</Pill>}
            {lph > 0 && (
              <Pill>
                <Bolt size={14} /> {p.specs['Purification Capacity']} / hr
              </Pill>
            )}
          </div>

          <h1 className="display-2 mt-4">{p.name}</h1>
          {p.configuration && (
            <p className="mt-2 font-display text-[19px] font-medium text-muted">
              {p.configuration}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
            <span className="font-display text-[38px] leading-none font-bold tracking-[-0.035em]">
              {priceLabel(p.price)}
            </span>
          </div>
          <p className="mt-2 text-[13.5px] text-muted">
            {p.price
              ? 'M.R.P. inclusive of all taxes, as printed in the V-Tech Aqua 2023 catalogue. Ask us for the current rate.'
              : 'The catalogue prints no rate for this model. Ask us for the current rate.'}
          </p>

          {p.features.length > 0 && (
            <ul className="mt-7 space-y-2.5">
              {p.features.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
                  <Check size={17} className="mt-0.5 shrink-0 text-blue" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-12 w-12 place-items-center rounded-full hover:bg-mist"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-display text-[15px] font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-12 w-12 place-items-center rounded-full hover:bg-mist"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button onClick={() => add(p.id, qty)} className="btn-dark flex-1 min-w-[170px]">
              <Bag size={17} /> Add to enquiry
            </button>
            <Link
              to="/quote"
              onClick={() => add(p.id, qty, { silent: true })}
              className="btn-primary flex-1 min-w-[160px]"
            >
              Get a quote <ArrowRight size={17} />
            </Link>
          </div>

          <a
            href={whatsappLink(
              primary.phone,
              `Hello, I would like a quotation for the ${p.name}${p.variant ? ` (${p.variant})` : ''}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-3 w-full"
          >
            <Phone size={17} /> WhatsApp {primary.name.split(' ')[0]} — {primary.display}
          </a>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
            {[
              [Shield, company.certification],
              [Pin, `${company.address.city}, ${company.address.state}`],
              [Phone, 'Call or WhatsApp'],
            ].map(([Icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon size={20} className="text-muted" />
                <span className="text-[12.5px] leading-tight text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- tabs ---------- */}
      <section className="shell py-10 md:py-16">
        <div
          role="tablist"
          aria-label="Product details"
          className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line pb-4"
        >
          {[
            ['specs', 'Specifications'],
            [stageList.length ? 'stack' : null, p.cartridges.length ? 'Filter stack' : 'Components supplied'],
            ['faq', 'Questions'],
          ]
            .filter(([id]) => id)
            .map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-selected={tab === id}
                role="tab"
                className={`btn btn-sm shrink-0 border ${
                  tab === id
                    ? 'border-transparent bg-ink text-white'
                    : 'border-line text-muted hover:border-ink hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
        </div>

        <div className="pt-9">
          {tab === 'specs' && (
            <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
              <dl className="divide-y divide-line border-t border-line">
                {Object.entries(p.specs).map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-4 sm:grid-cols-[240px_1fr] sm:gap-6">
                    <dt className="font-display text-[14px] font-semibold text-muted">{k}</dt>
                    <dd className="text-[14.5px] leading-relaxed">{v}</dd>
                  </div>
                ))}
                <div className="grid gap-1 py-4 sm:grid-cols-[240px_1fr] sm:gap-6">
                  <dt className="font-display text-[14px] font-semibold text-muted">
                    Catalogue reference
                  </dt>
                  <dd className="text-[14.5px] leading-relaxed">
                    {p.catalogueName} · page {p.sourcePage}
                  </dd>
                </div>
              </dl>

              <aside className="rounded-4xl border border-line p-6">
                <h3 className="font-display text-[17px] font-semibold">Worth checking first</h3>
                <ul className="mt-4 space-y-2.5 text-[14px] text-muted">
                  {[
                    'Your feed water — borewell, municipal or tanker',
                    'Litres you need per day, not litres of storage',
                    'Inlet pressure available at the site',
                    'The space and mounting this model needs',
                    'What installation and servicing will involve',
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-blue" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl bg-mist p-4">
                  <p className="font-display text-[14px] font-semibold">Before you order</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                    These decide whether this is the right model. Call{' '}
                    {company.contacts[0].display} and we will go through them with you.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {tab === 'stack' && (
            <div className="max-w-3xl">
              <p className="mb-6 text-[15px] leading-relaxed text-muted">
                {p.cartridges.length
                  ? 'The cartridges fitted to this model, in the order water passes through them.'
                  : 'Every major component supplied with this plant, as listed in the catalogue.'}
              </p>
              <ol className="divide-y divide-line border-t border-line">
                {stageList.map((s, i) => (
                  <li key={`${s}-${i}`} className="flex items-center gap-4 py-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-wash font-display text-[13px] font-bold text-blue-ink">
                      {i + 1}
                    </span>
                    <span className="text-[14.5px]">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === 'faq' && (
            <div className="max-w-3xl">
              <Accordion items={faqs} />
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell py-14 md:py-20">
          <SectionHead
            eyebrow={`More from ${section.label}`}
            title="Other models in this range."
            action="See all"
            actionTo={`/shop?c=${p.section}`}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
