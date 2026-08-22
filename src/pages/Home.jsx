import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bySection, company, faqs, getProduct, sections } from '../data/products'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import WaterFinder from '../components/WaterFinder'
import HeroShowcase from '../components/HeroShowcase'
import { Accordion, Marquee, SectionHead } from '../components/ui'
import { ArrowRight, Droplet, Phone, Pin, Shield } from '../components/Icons'
import { priceLabel, whatsappLink } from '../lib/format'

const PROMISES = [
  {
    icon: Droplet,
    title: 'Thirty models, three ranges',
    body: 'Domestic cabinets, commercial systems and industrial plants, all in one place.',
  },
  {
    icon: Shield,
    title: company.certification,
    body: 'The certification carried on the plants in our range.',
  },
  {
    icon: Phone,
    title: 'Talk to us directly',
    body: `${company.contacts[0].name.split(' ')[0]} and ${company.contacts[1].name.split(' ')[0]} — both numbers take calls and WhatsApp.`,
  },
  {
    icon: Pin,
    title: `${company.address.city}, ${company.address.state}`,
    body: 'Come and see the range on Bhavnagar Road, Marutinagar.',
  },
]

export default function Home() {
  return (
    <>
      <Hero />
      <TrustRail />
      <Promises />
      <Ranges />
      <WaterFinder />
      <Featured />
      <HowItWorks />
      <FaqBlock />
      <ClosingCta />
    </>
  )
}

/* =========================================================
   Hero
   ========================================================= */
function Hero() {
  const primary = company.contacts[0]

  return (
    <section className="shell pt-4 pb-2 md:pt-6">
      <div className="canvas water-field min-h-[600px] px-5 py-12 md:min-h-[700px] md:px-14 md:py-16">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full opacity-60 animate-drift"
          style={{ background: 'radial-gradient(circle, rgba(168,236,244,.9), transparent 65%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-[380px] w-[380px] rounded-full opacity-50 animate-drift"
          style={{
            background: 'radial-gradient(circle, rgba(14,116,207,.4), transparent 65%)',
            animationDelay: '3s',
          }}
        />

        <div className="relative grid h-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="chip">
              <Pin size={14} className="text-blue" />
              Botad, Gujarat · {company.certification}
            </span>

            <h1 className="display-1 mt-6 max-w-[18ch]">Clean water for homes, shops and plants.</h1>

            <p className="lede mt-6 max-w-lg !text-ink/70">
              Thirty RO models under one roof — from a 12-litre kitchen cabinet to a 3000 LPH
              industrial plant. The full V-Tech Aqua range, from {company.name} in{' '}
              {company.address.city}.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                See the full range <ArrowRight size={17} />
              </Link>
              <a
                href={whatsappLink(
                  primary.phone,
                  'Hello, I would like to enquire about an RO system.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Phone size={17} /> {primary.display}
              </a>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-7">
              {[
                ['30', 'models in the range'],
                ['3', 'ranges: home, shop, plant'],
                ['3000', 'LPH largest plant'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-[26px] leading-none font-bold tracking-[-0.03em]">
                    {v}
                  </dt>
                  <dd className="mt-2 text-[13px] leading-tight text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   Trust rail
   ========================================================= */
function TrustRail() {
  return (
    <section className="border-y border-line py-7">
      <div className="shell flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
        <p className="eyebrow shrink-0 text-muted-2">What the range covers</p>
        <Marquee
          items={[
            'Domestic alkaline RO',
            'RO + UV + UF + TDS',
            'Pressure tank systems',
            'Online RO systems',
            'Commercial RO plants',
            'FRP vessels & media beds',
            '4040 and 8040 membranes',
            'Industrial RO up to 3000 LPH',
          ]}
        />
      </div>
    </section>
  )
}

function Promises() {
  return (
    <section className="shell py-14 md:py-20">
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-wash text-blue-ink">
              <Icon size={21} />
            </span>
            <h3 className="mt-4 font-display text-[17px] font-semibold">{title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   The three ranges — the spine of the catalogue
   ========================================================= */
const RANGE_ART = {
  domestic: ['zuric-platinum', 'nine-platinum', 'jade'],
  commercial: ['online-50-ss', 'plant-150', 'pressure-tank-15'],
  industrial: ['plant-1000-auto', 'plant-3000', 'plant-250'],
}

function Ranges() {
  return (
    <section id="ranges" className="shell scroll-mt-24 py-14 md:py-20">
      <SectionHead
        eyebrow="Three ranges"
        title="Pick the range, then the size."
        sub="The catalogue divides into domestic cabinets, commercial systems and industrial plants. Almost every enquiry answers itself once you know which of the three you are in."
        className="reveal"
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {sections.map((s, i) => {
          const items = bySection(s.id)
          const hero = getProduct(RANGE_ART[s.id][0])
          const priced = items.filter((p) => typeof p.price === 'number')
          const from = priced.length ? Math.min(...priced.map((p) => p.price)) : null

          return (
            <article
              key={s.id}
              className="card reveal group overflow-hidden"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Link to={`/shop?c=${s.id}`} className="block">
                <ProductImage
                  product={hero}
                  className="aspect-[4/3]"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </Link>

              <div className="flex flex-1 flex-col p-6 md:p-7">
                <div className="flex items-center gap-2">
                  <span className="chip bg-mist py-1 text-[11.5px] text-muted">
                    {items.length} models
                  </span>
                  <span className="chip bg-mist py-1 text-[11.5px] text-muted">{s.pages}</span>
                </div>

                <h3 className="mt-4 font-display text-[24px] leading-tight font-semibold">
                  <Link to={`/shop?c=${s.id}`} className="link-underline">
                    {s.label}
                  </Link>
                </h3>
                <p className="mt-1.5 font-display text-[14.5px] font-medium text-blue-ink">
                  {s.tagline}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{s.blurb}</p>

                <ul className="mt-5 space-y-2 border-t border-line pt-5">
                  {RANGE_ART[s.id].map((slug) => {
                    const p = getProduct(slug)
                    return (
                      <li key={slug}>
                        <Link
                          to={`/p/${p.slug}`}
                          className="flex items-center justify-between gap-3 text-[13.5px] text-muted transition-colors hover:text-ink"
                        >
                          <span className="truncate">{p.name}</span>
                          <span className="shrink-0 font-display font-semibold text-ink">
                            {priceLabel(p.price)}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <div>
                    <p className="text-[12.5px] text-muted">Starting from</p>
                    <p className="font-display text-[20px] font-bold">
                      {from ? priceLabel(from) : 'On request'}
                    </p>
                  </div>
                  <Link to={`/shop?c=${s.id}`} className="btn-dark btn-sm">
                    View range <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* =========================================================
   Featured models, by range
   ========================================================= */
function Featured() {
  const [tab, setTab] = useState('domestic')
  const shown = bySection(tab).slice(0, 4)

  return (
    <section className="shell py-14 md:py-20">
      <SectionHead
        eyebrow="The range at a glance"
        title="Start with your range."
        action="Browse all 30"
        actionTo="/shop"
        className="reveal"
      />

      <div
        className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Product ranges"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={tab === s.id}
            onClick={() => setTab(s.id)}
            className={`btn btn-sm shrink-0 border ${
              tab === s.id
                ? 'border-transparent bg-ink text-white'
                : 'border-line bg-white text-muted hover:border-ink hover:text-ink'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   How RO works
   ========================================================= */
function HowItWorks() {
  return (
    <section className="shell py-14 md:py-20">
      <div className="canvas ink-field px-6 py-12 text-white md:px-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <p className="eyebrow text-white/45">How it works</p>
            <h2 className="display-2 mt-4 max-w-md text-white">
              Sediment, carbon, membrane — in that order.
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-white/60">
              Every system on this site runs the same basic sequence. What changes with size is the
              hardware: a domestic cabinet does it with cartridges, a 3000 LPH plant does it with FRP
              vessels, media beds and 8040 membranes.
            </p>
            <Link to="/technology" className="btn-ghost-invert mt-7">
              The full sequence <ArrowRight size={17} />
            </Link>
          </div>

          <ol className="reveal space-y-4">
            {[
              ['Sediment', 'Sand, silt and rust taken out first, so nothing scores the membrane.'],
              ['Carbon', 'Chlorine, odour and organics adsorbed before the membrane sees them.'],
              ['RO membrane', 'Dissolved salts and heavy metals rejected at the film.'],
              ['UV / UF', 'Bacteria and cysts dealt with on the models that carry them.'],
              ['Alkaline / TDS', 'Taste and mineral balance set at the last stage.'],
            ].map(([name, body], i) => (
              <li
                key={name}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 font-display text-[13px] font-bold">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display text-[15.5px] font-semibold">{name}</span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-white/55">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function FaqBlock() {
  return (
    <section className="shell py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-muted-2">Straight answers</p>
          <h2 className="display-2 mt-4">Common questions.</h2>
          <p className="lede mt-5">
            Starting with the one that decides everything: how many litres a day do you actually
            need?
          </p>
          <Link to="/support" className="btn-ghost mt-7">
            Service &amp; support <ArrowRight size={17} />
          </Link>
        </div>
        <div className="reveal">
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="shell pb-14 md:pb-20">
      <div className="canvas reveal ink-field px-6 py-14 text-center text-white md:px-14 md:py-24">
        <p className="eyebrow text-white/45">Get in touch</p>
        <h2 className="display-1 mx-auto mt-6 max-w-[16ch] text-white">Know your water.</h2>
        <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/60">
          Tell us how many litres a day you need and where the system is going, and we will talk you
          through the models that fit. Call either number, or send the details across.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/quote" className="btn bg-white text-ink hover:bg-glow">
            Request a quotation <ArrowRight size={17} />
          </Link>
          <Link to="/shop" className="btn-ghost-invert">
            Browse all 30 models
          </Link>
        </div>
        <p className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-white/40">
          {company.contacts.map((c) => (
            <a key={c.phone} href={`tel:+${c.phone}`} className="hover:text-white">
              {c.name} · {c.display}
            </a>
          ))}
        </p>
      </div>
    </section>
  )
}
