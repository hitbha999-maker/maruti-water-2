import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { recommend } from '../data/products'
import { priceLabel } from '../lib/format'
import { useStore } from '../lib/store'
import ProductImage from './ProductImage'
import { ArrowRight, Check, Droplet } from './Icons'

const SETTINGS = [
  { id: 'home', label: 'A home', hint: 'Family kitchen, flat or bungalow' },
  { id: 'business', label: 'A shop or office', hint: 'Tea stall, clinic, showroom, small office' },
  { id: 'plant', label: 'A plant or institution', hint: 'School, hotel, factory, packaged water' },
]

/* Common starting points, so nobody has to guess a number cold. */
const PRESETS = {
  home: [
    ['Family of 3–4', 25],
    ['Family of 5–6', 40],
    ['Joint family', 70],
  ],
  business: [
    ['Small shop', 100],
    ['Office of 25', 250],
    ['Clinic / café', 450],
    ['Small hotel', 900],
  ],
  plant: [
    ['School', 2500],
    ['Hotel / hostel', 5000],
    ['Factory canteen', 9000],
    ['Packaged water unit', 20000],
  ],
}

const NEEDS = [
  { id: 'alkaline', label: 'Alkaline water' },
  { id: 'uv', label: 'UV sterilisation' },
  { id: 'tds', label: 'TDS controller' },
  { id: 'steel', label: 'Stainless steel body' },
  { id: 'budget', label: 'Keep the cost down' },
]

const STEPS = ['Where', 'How much', 'What matters']

export default function WaterFinder() {
  const [step, setStep] = useState(0)
  const [setting, setSetting] = useState('home')
  const [litres, setLitres] = useState(25)
  const [needs, setNeeds] = useState([])
  const [done, setDone] = useState(false)
  const { add } = useStore()

  const results = useMemo(
    () => (done ? recommend({ setting, litresPerDay: litres, needs }) : []),
    [done, setting, litres, needs],
  )

  const pickSetting = (id) => {
    setSetting(id)
    setLitres(PRESETS[id][0][1])
  }

  const toggleNeed = (id) =>
    setNeeds((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))

  const requiredLph = results[0]?.requiredLph ?? 0

  return (
    <section id="finder" className="shell scroll-mt-24 py-14 md:py-20">
      <div className="canvas ink-field px-5 py-10 text-white md:px-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-white/45">Requirement finder</p>
            <h2 className="display-2 mt-4 text-white">
              Three questions.
              <br />
              The right size.
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-white/60">
              Capacity is the decision that costs money to get wrong. Undersize it and the tank never
              catches up; oversize it and you have paid for litres you will not drink. Tell us the
              daily figure and we will shortlist three models from the catalogue.
            </p>

            <ol className="mt-9 space-y-3">
              {STEPS.map((s, i) => {
                const state = done || i < step ? 'done' : i === step ? 'now' : 'todo'
                return (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-[12.5px] font-bold transition-colors duration-300 ${
                        state === 'done'
                          ? 'bg-aqua text-ink'
                          : state === 'now'
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white/45'
                      }`}
                    >
                      {state === 'done' ? <Check size={14} /> : i + 1}
                    </span>
                    <span
                      className={`font-display text-[15px] font-medium ${
                        state === 'todo' ? 'text-white/40' : 'text-white'
                      }`}
                    >
                      {s}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="rounded-4xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md md:p-8">
            {!done ? (
              <>
                {step === 0 && (
                  <Fieldset
                    legend="Where is the system going?"
                    help="This decides the whole shape of the answer — a cabinet on the kitchen wall, or a skid with FRP vessels."
                  >
                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {SETTINGS.map((s) => (
                        <Choice
                          key={s.id}
                          active={setting === s.id}
                          onClick={() => pickSetting(s.id)}
                          title={s.label}
                          hint={s.hint}
                        />
                      ))}
                    </div>
                  </Fieldset>
                )}

                {step === 1 && (
                  <Fieldset
                    legend="How many litres a day?"
                    help="Drinking and cooking only — not washing. Pick the closest starting point and adjust."
                  >
                    <div className="rounded-3xl bg-black/45 p-5">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <span className="font-display text-[52px] leading-none font-bold">
                          {litres.toLocaleString('en-IN')}
                          <span className="ml-1.5 text-[18px] font-medium text-white/40">L / day</span>
                        </span>
                        <span className="font-display text-[13.5px] font-semibold text-aqua-2">
                          ≈ {Math.ceil(litres / (setting === 'home' ? 6 : 8))} LPH needed
                        </span>
                      </div>

                      <input
                        type="range"
                        min="10"
                        max={setting === 'home' ? 200 : setting === 'business' ? 2000 : 30000}
                        step={setting === 'home' ? 5 : setting === 'business' ? 25 : 500}
                        value={litres}
                        onChange={(e) => setLitres(+e.target.value)}
                        aria-label="Litres required per day"
                        className="mt-5 w-full accent-white"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="eyebrow mb-2.5 text-white/45">Typical starting points</p>
                      <div className="flex flex-wrap gap-2">
                        {PRESETS[setting].map(([label, v]) => (
                          <button
                            key={label}
                            onClick={() => setLitres(v)}
                            className={`chip transition-colors ${
                              litres === v
                                ? 'border-transparent bg-white text-black'
                                : 'border-white/15 bg-white/5 text-white/70 hover:border-white/50'
                            }`}
                          >
                            {label}
                            <span className="opacity-50">{v} L</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Fieldset>
                )}

                {step === 2 && (
                  <Fieldset
                    legend="Anything else that matters?"
                    help="Optional — pick as many as apply, or none at all."
                  >
                    <div className="flex flex-wrap gap-2.5">
                      {NEEDS.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => toggleNeed(w.id)}
                          aria-pressed={needs.includes(w.id)}
                          className={`btn btn-sm border ${
                            needs.includes(w.id)
                              ? 'border-transparent bg-white text-black'
                              : 'border-white/20 bg-white/5 text-white hover:border-white/60'
                          }`}
                        >
                          {needs.includes(w.id) && <Check size={15} />}
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </Fieldset>
                )}

                <div className="mt-9 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="text-[14px] text-white/55 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => (step === 2 ? setDone(true) : setStep((s) => s + 1))}
                    className="btn bg-white text-black hover:bg-[#e9e9ee]"
                  >
                    {step === 2 ? 'Show my shortlist' : 'Continue'} <ArrowRight size={17} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow text-white/45">Your shortlist</p>
                    <h3 className="mt-2 font-display text-[26px] leading-tight font-semibold">
                      {results[0]?.product.name} fits best
                    </h3>
                    <p className="mt-1.5 text-[14px] text-white/55">
                      {litres.toLocaleString('en-IN')} L a day · about {requiredLph} LPH ·{' '}
                      {SETTINGS.find((s) => s.id === setting).label.toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDone(false)
                      setStep(0)
                    }}
                    className="btn-ghost-invert btn-sm"
                  >
                    Start over
                  </button>
                </div>

                <p className="mt-5 flex items-start gap-2.5 rounded-2xl border border-aqua/25 bg-aqua/10 p-4 text-[13.5px] leading-relaxed text-white/80">
                  <Droplet size={17} className="mt-0.5 shrink-0 text-aqua-2" />
                  This is a starting point from the catalogue, not a final specification. Your feed
                  water and inlet pressure decide the rest, so talk to us before ordering.
                </p>

                <ul className="mt-6 space-y-3">
                  {results.map(({ product: p, notes }, i) => (
                    <li
                      key={p.id}
                      className={`rounded-3xl border p-4 transition-colors md:p-5 ${
                        i === 0 ? 'border-white/25 bg-white/[0.07]' : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex gap-4">
                        <ProductImage
                          product={p}
                          className="h-24 w-24 shrink-0 rounded-2xl"
                          plate="bg-graphite"
                          sizes="96px"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-display text-[18px] font-semibold">{p.name}</h4>
                            {i === 0 && (
                              <span className="chip border-transparent bg-aqua py-1 text-[11.5px] text-ink">
                                Best fit
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-white/50">
                            {p.sectionLabel} · {p.variant || p.configuration}
                          </p>

                          {i === 0 && notes.length > 0 && (
                            <ul className="mt-3 space-y-1.5">
                              {notes.map((n) => (
                                <li
                                  key={n}
                                  className="flex items-start gap-2 text-[13px] leading-relaxed text-white/70"
                                >
                                  <Check size={14} className="mt-0.5 shrink-0 text-aqua-2" />
                                  {n}
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="mt-4 flex flex-wrap items-center gap-2.5">
                            <span className="font-display text-[17px] font-bold">
                              {priceLabel(p.price)}
                            </span>
                            <button
                              onClick={() => add(p.id)}
                              className="btn btn-sm bg-white text-black hover:bg-[#e9e9ee]"
                            >
                              Add to enquiry
                            </button>
                            <Link to={`/p/${p.slug}`} className="btn-ghost-invert btn-sm">
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Fieldset({ legend, help, children }) {
  return (
    <fieldset>
      <legend className="font-display text-[22px] leading-tight font-semibold md:text-[26px]">
        {legend}
      </legend>
      <p className="mt-2 mb-6 max-w-lg text-[14px] leading-relaxed text-white/50">{help}</p>
      {children}
    </fieldset>
  )
}

function Choice({ active, onClick, title, hint }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
        active
          ? 'border-white bg-white text-black'
          : 'border-white/15 bg-white/[0.03] text-white hover:border-white/45'
      }`}
      style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-display text-[15.5px] font-semibold">{title}</span>
        {active && <Check size={17} />}
      </span>
      <span className={`mt-1 block text-[13px] ${active ? 'text-muted' : 'text-white/45'}`}>
        {hint}
      </span>
    </button>
  )
}
