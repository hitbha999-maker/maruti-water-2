import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { company, faqs, products } from '../data/products'
import { Accordion, SectionHead } from '../components/ui'
import { whatsappLink } from '../lib/format'
import { ArrowRight, Check, Droplet, Phone, Truck, Wrench } from '../components/Icons'

const CHANNELS = [
  {
    icon: Phone,
    title: 'Call us',
    body: 'Straight through to Ashvin or Dharmesh on the numbers below.',
    action: company.contacts[0].display,
    href: `tel:+${company.contacts[0].phone}`,
  },
  {
    icon: Droplet,
    title: 'Check your water',
    body: 'Not sure what your feed water needs? Send the details and we will talk it through.',
    action: 'Ask us',
    href: '#request',
  },
  {
    icon: Wrench,
    title: 'Service & repair',
    body: 'Cartridge change, membrane swap, a leak or a unit that has stopped.',
    action: 'Send the details',
    href: '#request',
  },
  {
    icon: Truck,
    title: 'Spares & cartridges',
    body: 'Tell us your model and the cartridge you need and we will check availability.',
    action: 'Ask for a part',
    href: '#request',
  },
]

const ISSUES = [
  'Scheduled cartridge change',
  'Water tastes or smells different',
  'Low output / slow filling',
  'Leak or drip',
  'Unit not switching on',
  'Advice before buying (no system yet)',
  'Spare part required',
  'Something else',
]

/* Replacement intervals in months. */
const SCHEDULE = [
  ['Sediment cartridge', 6],
  ['Carbon cartridge', 6],
  ['UV lamp', 12],
  ['RO membrane', 30],
]

export default function Support() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', model: '', issue: ISSUES[0], note: '' })
  const [sent, setSent] = useState(false)
  const [installed, setInstalled] = useState('')

  const due = useMemo(() => {
    if (!installed) return null
    const start = new Date(installed)
    if (Number.isNaN(start.getTime())) return null
    const now = new Date()
    return SCHEDULE.map(([part, months]) => {
      const elapsed = Math.max(
        0,
        (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()),
      )
      const cycles = Math.floor(elapsed / months) + 1
      const next = new Date(start)
      next.setMonth(start.getMonth() + cycles * months)
      return { part, next, daysLeft: Math.round((next - now) / 86400000) }
    })
  }, [installed])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const waText = `Hello ${company.name}, I need service support.
Name: ${form.name || '—'}
Phone: ${form.phone || '—'}
Area: ${form.city || '—'}
Model: ${form.model || 'Not sure'}
Issue: ${form.issue}${form.note ? `\nNotes: ${form.note}` : ''}`

  return (
    <>
      <section className="shell pt-10 pb-8 md:pt-14">
        <p className="eyebrow text-muted-2">Service &amp; support</p>
        <h1 className="display-2 mt-4 max-w-[22ch]">
          A purifier is only as good as the last service.
        </h1>
        <p className="lede mt-5 max-w-2xl">
          Cartridges that are never changed are worse than no purifier at all. Tell us what your
          system needs and we will take it from there.
        </p>
      </section>

      <section className="shell pb-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ icon: Icon, title, body, action, href }, i) => (
            <article key={title} className="card reveal p-6" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-wash text-blue-ink">
                <Icon size={21} />
              </span>
              <h2 className="mt-5 font-display text-[17px] font-semibold">{title}</h2>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{body}</p>
              <a
                href={href}
                className="mt-5 inline-flex items-center gap-1.5 font-display text-[14px] font-semibold text-blue-ink"
              >
                {action} <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="request" className="shell scroll-mt-24 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
          <div>
            <SectionHead
              eyebrow="Service request"
              title="Tell us what is happening."
              sub="Send it across and we will get back to you. For anything urgent, WhatsApp is fastest."
              className="reveal"
            />

            {sent ? (
              <div className="reveal mt-9 rounded-4xl border border-blue/20 bg-blue-wash p-8">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue text-white">
                  <Check size={24} />
                </span>
                <h3 className="mt-5 font-display text-[22px] font-semibold">Ready to send</h3>
                <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-muted">
                  We have prepared your request for <strong className="text-ink">{form.issue}</strong>
                  {form.city && <> in {form.city}</>}. Send it on WhatsApp or call — both reach the
                  same two people.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={whatsappLink(company.contacts[0].phone, waText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary btn-sm"
                  >
                    <Phone size={15} /> Send on WhatsApp
                  </a>
                  <a href={`tel:+${company.contacts[0].phone}`} className="btn-ghost btn-sm">
                    Call {company.contacts[0].display}
                  </a>
                  <button onClick={() => setSent(false)} className="btn-ghost btn-sm">
                    Edit details
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="reveal mt-9 grid gap-4 sm:grid-cols-2"
              >
                <label className="block">
                  <span className="eyebrow mb-2 block text-muted-2">Your name</span>
                  <input required value={form.name} onChange={set('name')} className="field" placeholder="Full name" />
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block text-muted-2">Phone</span>
                  <input
                    required
                    inputMode="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    className="field"
                    placeholder="10-digit mobile"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block text-muted-2">Town or area</span>
                  <input value={form.city} onChange={set('city')} className="field" placeholder="Botad" />
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block text-muted-2">Model</span>
                  <select value={form.model} onChange={set('model')} className="field">
                    <option value="">Not sure / not ours yet</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                        {p.variant ? ` — ${p.variant}` : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="eyebrow mb-2 block text-muted-2">What do you need?</span>
                  <select value={form.issue} onChange={set('issue')} className="field">
                    {ISSUES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="eyebrow mb-2 block text-muted-2">Anything else (optional)</span>
                  <textarea
                    rows={4}
                    value={form.note}
                    onChange={set('note')}
                    className="field resize-none"
                    placeholder="Describe what you are seeing"
                  />
                </label>

                <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                  <button type="submit" className="btn-primary">
                    Prepare request <ArrowRight size={17} />
                  </button>
                  <p className="text-[13px] text-muted">
                    Or call{' '}
                    <a
                      href={`tel:+${company.contacts[0].phone}`}
                      className="font-semibold text-ink hover:underline"
                    >
                      {company.contacts[0].display}
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="reveal">
            <div className="rounded-4xl border border-line p-6 md:p-7">
              <p className="eyebrow text-muted-2">Cartridge schedule</p>
              <h3 className="mt-3 font-display text-[21px] leading-tight font-semibold">
                When is your next change due?
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Enter the installation date to see the usual replacement intervals mapped out.
              </p>

              <label className="mt-5 block">
                <span className="eyebrow mb-2 block text-muted-2">Installed on</span>
                <input
                  type="date"
                  value={installed}
                  onChange={(e) => setInstalled(e.target.value)}
                  className="field"
                />
              </label>

              {due && (
                <ul className="mt-6 divide-y divide-line border-t border-line">
                  {due.map(({ part, next, daysLeft }) => (
                    <li key={part} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate font-display text-[14px] font-semibold">{part}</p>
                        <p className="text-[12.5px] text-muted">
                          {next.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className={`chip py-1 text-[11.5px] ${
                          daysLeft < 0
                            ? 'border-transparent bg-rose-50 text-rose-600'
                            : daysLeft < 45
                              ? 'border-transparent bg-amber-50 text-amber-700'
                              : 'bg-mist text-muted'
                        }`}
                      >
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `in ${daysLeft}d`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-5 text-[12.5px] leading-relaxed text-muted-2">
                Typical intervals only. Silty or high-TDS borewell feed shortens all of them, so
                treat these as a reminder rather than a specification.
              </p>
            </div>

            <div className="mt-4 rounded-4xl ink-field p-6 text-white md:p-7">
              <p className="font-display text-[18px] leading-snug font-semibold">
                Prefer to just message us?
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                Both numbers take WhatsApp. A photo of the unit and its label usually tells us
                what we need to know.
              </p>
              <div className="mt-5 grid gap-2">
                {company.contacts.map((c) => (
                  <a
                    key={c.phone}
                    href={whatsappLink(c.phone, 'Hello, I need service support for my RO system.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-invert btn-sm w-full justify-between"
                  >
                    <span>{c.name.split(' ')[0]}</span>
                    <span>{c.display}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-muted-2">Help centre</p>
            <h2 className="display-2 mt-4">Common questions.</h2>
            <p className="lede mt-5">Six answers worth reading before you call.</p>
            <Link to="/quote" className="btn-ghost mt-7">
              Request a quotation <ArrowRight size={17} />
            </Link>
          </div>
          <div className="reveal">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  )
}
