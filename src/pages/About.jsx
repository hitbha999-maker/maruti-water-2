import { Link } from 'react-router-dom'
import { bySection, company, getProduct, sections } from '../data/products'
import ProductImage from '../components/ProductImage'
import { SectionHead, StatBlock } from '../components/ui'
import { whatsappLink } from '../lib/format'
import { ArrowRight, Droplet, Phone, Pin, Shield } from '../components/Icons'

/* Everything on this page is either verifiable from the client's own catalogue
   and signage, or is written as an invitation to ask rather than a promise. */

const HOW_TO_CHOOSE = [
  {
    icon: Droplet,
    title: 'Start with your water',
    body: 'Feed water decides more than the model name does. Borewell water in Saurashtra behaves very differently from a municipal line, and it changes which stages are worth paying for.',
  },
  {
    icon: ArrowRight,
    title: 'Then your daily volume',
    body: 'Litres per day, not litres of storage. It is the number that separates a domestic cabinet from a commercial system, and a commercial system from a plant.',
  },
  {
    icon: Shield,
    title: 'Then the body and the site',
    body: 'MSPC or stainless, wall-mounted or a plumbed skid, indoors or a wash-down area. Two models that both clear your volume can still be the wrong and right answer.',
  },
]

export default function About() {
  const { address } = company
  const plant = getProduct('plant-2000')

  return (
    <>
      <section className="shell pt-6 pb-2">
        <div className="canvas water-field px-5 py-14 md:px-14 md:py-20">
          <p className="eyebrow text-blue-ink">About us</p>
          <h1 className="display-1 mt-6 max-w-[17ch]">Water systems, from one place in Botad.</h1>
          <p className="lede mt-6 max-w-2xl !text-ink/70">
            {company.name} carries the V-Tech Aqua range of reverse-osmosis systems — from a
            12-litre kitchen cabinet through to 3000 LPH plants built on FRP vessels and 8040
            membranes. Thirty models, three ranges, one conversation.
          </p>

          <div className="mt-12 grid max-w-3xl grid-cols-2 gap-8 border-t border-ink/10 pt-9 md:grid-cols-4">
            <StatBlock value="30" label="Models in the range" sub="Across three ranges" size="md" />
            <StatBlock value="3000" label="LPH largest plant" sub="Industrial range" size="md" />
            <StatBlock value="ISO" label="9001:2015" sub="On the plants we carry" size="md" />
            <StatBlock value="Botad" label="Gujarat" sub="Where to find us" size="md" />
          </div>
        </div>
      </section>

      {/* what we do */}
      <section className="shell py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-20">
          <div className="reveal">
            <p className="eyebrow text-muted-2">What we do</p>
            <h2 className="display-2 mt-4 max-w-xl">
              One supplier for the house, the shop and the plant.
            </h2>
            <div className="mt-7 space-y-5 text-[16px] leading-relaxed text-muted">
              <p>
                Most water businesses pick a lane — domestic dealers who cannot size a plant, or
                plant suppliers who will not look at a kitchen cabinet. We carry all three ranges,
                because customers rarely stay in one lane: the family that buys a purifier this year
                runs the workshop that needs 2000 LPH next year.
              </p>
              <p>
                The site lists every model in the current catalogue with the printed M.R.P. against
                it, so you can compare like for like before you call. Where the catalogue prints no
                rate, we say so rather than inventing one.
              </p>
              <p>
                What it cannot do is pick for you. Capacity, feed water and the space you have all
                move the answer, and they are worth ten minutes on the phone before you order.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/technology" className="btn-ghost">
                How the systems work <ArrowRight size={17} />
              </Link>
              <Link to="/quote" className="btn-primary">
                Send us your requirement
              </Link>
            </div>
          </div>

          <div className="reveal">
            <ProductImage
              product={plant}
              className="aspect-square w-full rounded-4xl"
              plate="bg-mist"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              A 2000 LPH plant from the industrial range, built on FRP vessels with 8040 membranes.
              Photograph from the V-Tech Aqua 2023 catalogue.
            </p>
          </div>
        </div>
      </section>

      {/* how to choose */}
      <section className="shell py-14 md:py-20">
        <div className="canvas ink-field px-6 py-12 text-white md:px-14 md:py-16">
          <SectionHead
            eyebrow="How to choose"
            title="Three questions, in this order."
            sub="Get these right and the model almost picks itself. Get them wrong and no amount of stages will fix it."
            invert
            className="reveal"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HOW_TO_CHOOSE.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="reveal border-t border-white/12 pt-7"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-aqua-2">
                  <Icon size={21} />
                </span>
                <h3 className="mt-5 font-display text-[20px] leading-tight font-semibold">{title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/60">{body}</p>
              </div>
            ))}
          </div>
          <p className="reveal mt-10 max-w-2xl text-[14px] leading-relaxed text-white/45">
            The Requirement Finder on the home page walks through the same three questions and
            shortlists three models from the catalogue.
          </p>
        </div>
      </section>

      {/* ranges */}
      <section className="shell py-14 md:py-20">
        <SectionHead
          eyebrow="The range"
          title="Thirty models, three ranges."
          action="Browse everything"
          actionTo="/shop"
          className="reveal"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {sections.map((s, i) => (
            <article
              key={s.id}
              className="card reveal p-6 md:p-7"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className="chip bg-mist py-1 text-[11.5px] text-muted">
                {bySection(s.id).length} models
              </span>
              <h3 className="mt-4 font-display text-[21px] leading-tight font-semibold">{s.label}</h3>
              <p className="mt-1.5 font-display text-[14px] font-medium text-blue-ink">{s.tagline}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{s.blurb}</p>
              <Link
                to={`/shop?c=${s.id}`}
                className="mt-6 inline-flex items-center gap-1.5 font-display text-[14px] font-semibold text-blue-ink"
              >
                View range <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* find us */}
      <section className="shell pb-20">
        <div className="canvas bg-mist px-6 py-12 md:px-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="reveal">
              <p className="eyebrow text-muted-2">Find us</p>
              <h2 className="display-2 mt-4 max-w-md">Come and see the range.</h2>
              <address className="mt-7 flex gap-3 text-[16px] leading-relaxed text-muted not-italic">
                <Pin size={20} className="mt-1 shrink-0 text-blue" />
                <span>
                  <strong className="font-semibold text-ink">{company.name}</strong>
                  <br />
                  {address.line1}
                  <br />
                  {address.line2}
                  <br />
                  {address.city} {address.pin}, {address.state}
                </span>
              </address>
              <p className="mt-6 flex items-center gap-2 text-[14px] text-muted">
                <Shield size={17} className="text-blue" /> {company.certification}
              </p>
            </div>

            <div className="reveal grid content-start gap-3">
              {company.contacts.map((c) => (
                <div
                  key={c.phone}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5"
                >
                  <div>
                    <p className="font-display text-[16px] font-semibold">{c.name}</p>
                    <p className="mt-0.5 text-[13px] text-muted">Call or WhatsApp</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:+${c.phone}`} className="btn-ghost btn-sm">
                      <Phone size={15} /> {c.display}
                    </a>
                    <a
                      href={whatsappLink(c.phone, 'Hello, I would like to enquire about an RO system.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary btn-sm"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                Ask us about installation, servicing and cartridge supply for the model you are
                considering — it is worth settling before you order rather than after.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
