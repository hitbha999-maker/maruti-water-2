import { Link } from 'react-router-dom'
import StageDiagram from '../components/StageDiagram'
import ProductImage from '../components/ProductImage'
import { Accordion, Pill, SectionHead } from '../components/ui'
import { company, faqs, getProduct } from '../data/products'
import { ArrowRight, Bolt, Droplet, Shield, Wrench } from '../components/Icons'

/* Hardware scales with capacity. These are the actual element and vessel sizes
   used across the three ranges, taken from the catalogue component lists. */
const SCALE = [
  {
    range: 'Domestic',
    capacity: '12 – 15 litres per hour',
    membrane: 'Compact domestic element',
    vessel: 'ABS food-grade cabinet',
    pump: 'Booster pump; the cabinet as a whole draws 45 W in use',
    note: 'Everything is cartridge-based, so a service visit is a swap rather than a strip-down.',
  },
  {
    range: 'Commercial',
    capacity: '15 – 150 litres per hour',
    membrane: '4021 element in an FRP or SS pressure tube',
    vessel: '20" big-blue jumbo housings',
    pump: 'Raw-water pump plus a high-pressure pump',
    note: 'From 100 LPH upward the system becomes a plumbed skid with a control panel and rotameter.',
  },
  {
    range: 'Industrial',
    capacity: '250 – 3000 litres per hour',
    membrane: '4040 elements, then 8040 on the largest plants',
    vessel: 'FRP vessels 1054 and 1665 with sand, pebble and carbon media',
    pump: 'Multi-stage high-pressure pump, three-phase above 1000 LPH',
    note: 'Media beds do the pre-treatment that cartridges cannot sustain at this flow. Backwash is by MPV, manual or automatic.',
  },
]

const REMOVES = [
  ['Dissolved salts', 'The reason water tastes "heavy". Measured as TDS.'],
  ['Hardness', 'Calcium and magnesium — scale in kettles, geysers and boilers.'],
  ['Heavy metals', 'Lead, arsenic and similar, where present in the feed.'],
  ['Nitrate & fluoride', 'Common in Saurashtra borewell water.'],
  ['Bacteria & cysts', 'On models carrying a UV chamber or UF membrane.'],
  ['Chlorine & odour', 'Adsorbed by the carbon stage before the membrane.'],
]

const SERVICE = [
  ['Sediment & carbon cartridges', 'Every 6 months', 'Sooner on silty or borewell feed.'],
  ['UV lamp', 'Every 12 months', 'Output falls below germicidal level long before the lamp stops glowing.'],
  ['RO membrane', 'Every 2 – 3 years', 'Watch the output TDS; a steady climb is the signal.'],
  ['Media beds (plants)', 'Backwash regularly, recharge periodically', 'Sand, pebble and carbon in the FRP vessels.'],
]

export default function Technology() {
  const plant = getProduct('plant-500')

  return (
    <>
      <section className="shell pt-6 pb-2">
        <div className="canvas ink-field px-5 py-14 text-white md:px-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Pill tone="ghost">
                <Bolt size={15} /> How reverse osmosis works
              </Pill>
              <h1 className="display-1 mt-6 max-w-[13ch] text-white">Same sequence, different scale.</h1>
              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/60">
                A kitchen cabinet and a 3000 LPH plant do exactly the same job in the same order.
                What changes is the size of the hardware that does it — and that is the whole basis
                on which a system should be chosen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" className="btn bg-white text-black hover:bg-[#e9e9ee]">
                  See the range <ArrowRight size={17} />
                </Link>
                <Link to="/quote" className="btn-ghost-invert">
                  Talk to us about your water
                </Link>
              </div>
            </div>

            <ProductImage
              product={plant}
              className="mx-auto aspect-square w-full max-w-[440px] rounded-4xl"
              plate="bg-graphite"
              sizes="(max-width: 1024px) 90vw, 440px"
            />
          </div>
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        <SectionHead
          eyebrow="The sequence"
          title="Eight stages, in the order they matter."
          sub="Stage order is not decoration. Put carbon after the membrane instead of before it and chlorine reaches the film, which is the single most common way an RO membrane dies early."
          className="reveal"
        />
        <div className="reveal mt-12">
          <StageDiagram />
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        <SectionHead
          eyebrow="Scaling up"
          title="What changes as capacity grows."
          sub="This is the table worth reading before you decide between a large commercial system and a small industrial plant."
          className="reveal"
        />

        <div className="reveal mt-10 overflow-x-auto rounded-4xl border border-line">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-mist">
                {['Range', 'Capacity', 'Membrane', 'Pre-treatment', 'Pumping'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-5 font-display text-[13px] font-semibold tracking-[0.1em] text-muted-2 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCALE.map((r) => (
                <tr key={r.range} className="border-b border-line last:border-0 align-top">
                  <td className="px-6 py-5">
                    <span className="font-display text-[15px] font-bold">{r.range}</span>
                    <span className="mt-1.5 block max-w-[240px] text-[12.5px] leading-relaxed text-muted">
                      {r.note}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[14.5px] font-medium">{r.capacity}</td>
                  <td className="px-6 py-5 text-[14.5px] text-muted">{r.membrane}</td>
                  <td className="px-6 py-5 text-[14.5px] text-muted">{r.vessel}</td>
                  <td className="px-6 py-5 text-[14.5px] text-muted">{r.pump}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="canvas reveal bg-mist p-8 md:p-10">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-blue-ink">
              <Droplet size={21} />
            </span>
            <h2 className="display-3 mt-6 max-w-sm">What the membrane takes out.</h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink/65">
              How much of each depends entirely on your feed water, which is why no honest
              percentage can be printed here without testing your own supply first.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {REMOVES.map(([k, v]) => (
                <li key={k} className="rounded-2xl bg-white/5 p-3.5">
                  <span className="block font-display text-[14px] font-semibold">{k}</span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">{v}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="canvas reveal bg-mist p-8 md:p-10">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-blue-ink">
              <Wrench size={21} />
            </span>
            <h2 className="display-3 mt-6 max-w-sm">What it costs to keep running.</h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
              An RO system is a maintenance product. Cartridges that are never changed are worse
              than no purifier at all, so the intervals are worth knowing before you buy.
            </p>
            <dl className="mt-7 divide-y divide-line border-t border-line">
              {SERVICE.map(([k, when, note]) => (
                <div key={k} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <dt className="font-display text-[14.5px] font-semibold">{k}</dt>
                    <dd className="font-display text-[13.5px] font-semibold text-blue-ink">{when}</dd>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{note}</p>
                </div>
              ))}
            </dl>
            <Link to="/support" className="btn-ghost btn-sm mt-6">
              Ask about servicing <ArrowRight size={15} />
            </Link>
          </article>
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        <div className="canvas ink-field px-6 py-12 text-white md:px-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
            <div className="reveal">
              <p className="eyebrow text-white/45">Before you buy</p>
              <h2 className="display-2 mt-4 text-white">Three numbers decide everything.</h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-white/60">
                Feed-water TDS, litres needed per day, and the pressure available at the inlet. Get
                those three right and the model almost picks itself.
              </p>
              <Link to="/quote" className="btn mt-7 bg-white text-black hover:bg-[#e9e9ee]">
                Send us your requirement <ArrowRight size={17} />
              </Link>
              <p className="mt-6 flex items-center gap-2 text-[13px] text-white/40">
                <Shield size={15} /> {company.certification} certified
              </p>
            </div>
            <div className="reveal">
              <Accordion items={faqs} invert />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
