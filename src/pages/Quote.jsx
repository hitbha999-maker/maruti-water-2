import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { company } from '../data/products'
import ProductImage from '../components/ProductImage'
import { inr, priceLabel, whatsappLink } from '../lib/format'
import { ArrowRight, Check, Droplet, Phone, Pin, Wrench } from '../components/Icons'

const SETTINGS = ['A home', 'A shop or office', 'A school, hotel or factory', 'Packaged water unit', 'Not sure yet']
const SOURCES = ['Municipal supply', 'Borewell', 'Tanker', 'Mixed', "Don't know"]

export default function Quote() {
  const { lines, subtotal, quoteOnly, clear } = useStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    setting: SETTINGS[0],
    source: SOURCES[0],
    litres: '',
    message: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const summary = [
    `Name: ${form.name || '—'}`,
    `Phone: ${form.phone || '—'}`,
    `Location: ${form.city || '—'}`,
    `For: ${form.setting}`,
    `Water source: ${form.source}`,
    form.litres ? `Daily requirement: ${form.litres} litres` : null,
    lines.length ? `\nModels of interest:\n${lines.map((l) => `• ${l.item.name}${l.item.variant ? ` (${l.item.variant})` : ''} × ${l.qty}`).join('\n')}` : null,
    form.message ? `\nNotes: ${form.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const waText = `Hello ${company.name}, I would like a quotation.\n\n${summary}`
  const primary = company.contacts[0]

  if (sent) {
    return (
      <section className="shell py-16 md:py-24">
        <div className="canvas water-field mx-auto max-w-3xl px-6 py-16 text-center md:px-14">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue text-white">
            <Check size={30} />
          </span>
          <p className="eyebrow mt-7 text-blue-ink">Enquiry ready</p>
          <h1 className="display-2 mt-4">Send it across</h1>
          <p className="lede mx-auto mt-5 max-w-lg !text-ink/70">
            Your details are prepared below. Send them on WhatsApp, or call either number
            directly.
          </p>

          <pre className="mx-auto mt-8 max-w-lg overflow-x-auto rounded-2xl border border-line bg-white p-5 text-left font-sans text-[13.5px] leading-relaxed whitespace-pre-wrap text-muted">
            {summary}
          </pre>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(primary.phone, waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Phone size={17} /> Send on WhatsApp
            </a>
            <a href={`tel:+${primary.phone}`} className="btn-ghost">
              Call {primary.display}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSent(false)
                clear()
              }}
              className="text-[13.5px] text-muted underline decoration-line underline-offset-4 hover:text-ink"
            >
              Start a new enquiry
            </button>
          </div>

          <p className="mt-8 text-[12.5px] text-muted-2">
            This form does not take payment. Nothing is charged online — we quote first, then
            install.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="shell py-10 md:py-14">
      <p className="eyebrow text-muted-2">Request a quotation</p>
      <h1 className="display-2 mt-4 max-w-[20ch]">Tell us what the water has to do.</h1>
      <p className="lede mt-5 max-w-2xl">
        Capacity, feed water and where it is going — three things decide the quote. Fill in what you
        know and leave the rest to us.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,400px)] lg:gap-14">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field label="Your name" required value={form.name} onChange={set('name')} placeholder="Full name" />
          <Field
            label="Phone / WhatsApp"
            required
            inputMode="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="10-digit mobile"
          />
          <div className="sm:col-span-2">
            <Field label="Town or area" value={form.city} onChange={set('city')} placeholder="Your town or area" />
          </div>

          <label className="block">
            <span className="eyebrow mb-2 block text-muted-2">This is for</span>
            <select value={form.setting} onChange={set('setting')} className="field">
              {SETTINGS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block text-muted-2">Water source</span>
            <select value={form.source} onChange={set('source')} className="field">
              {SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <div className="sm:col-span-2">
            <Field
              label="Roughly how many litres a day?"
              inputMode="numeric"
              value={form.litres}
              onChange={set('litres')}
              placeholder="e.g. 40 for a family, 500 for an office"
            />
          </div>

          <label className="block sm:col-span-2">
            <span className="eyebrow mb-2 block text-muted-2">Anything else (optional)</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={set('message')}
              className="field resize-none"
              placeholder="Existing purifier, space available, water problems you have noticed…"
            />
          </label>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-4 border-t border-line pt-6">
            <button type="submit" className="btn-primary">
              Prepare my enquiry <ArrowRight size={17} />
            </button>
            <p className="text-[13px] text-muted">
              Or call{' '}
              <a href={`tel:+${primary.phone}`} className="font-semibold text-ink hover:underline">
                {primary.display}
              </a>
            </p>
          </div>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-4xl border border-line p-6">
            <h2 className="font-display text-[17px] font-semibold">
              Your enquiry {lines.length > 0 && <span className="text-muted-2">({lines.length})</span>}
            </h2>

            {lines.length === 0 ? (
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                Nothing added yet — that is fine. Send the form and we will suggest models, or{' '}
                <Link to="/shop" className="font-medium text-blue-ink hover:underline">
                  browse the range
                </Link>{' '}
                first.
              </p>
            ) : (
              <>
                <ul className="mt-5 space-y-4">
                  {lines.map((l) => (
                    <li key={l.id} className="flex gap-3.5">
                      <ProductImage product={l.item} className="h-16 w-16 shrink-0 rounded-xl" sizes="64px" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[14.5px] font-semibold">
                          {l.item.name}
                        </span>
                        <span className="block text-[12.5px] text-muted">Qty {l.qty}</span>
                      </span>
                      <span className="font-display text-[14px] font-semibold">
                        {typeof l.item.price === 'number' ? inr(l.item.price * l.qty) : priceLabel(null)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-2 border-t border-line pt-5 text-[14px]">
                  <div className="flex justify-between font-display text-[19px] font-bold">
                    <dt>Catalogue M.R.P.</dt>
                    <dd>{quoteOnly.length ? `From ${inr(subtotal)}` : inr(subtotal)}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                  Indicative only. Installation, plumbing and any pre-treatment are costed after the
                  site check.
                </p>
              </>
            )}
          </div>

          <div className="mt-4 rounded-4xl ink-field p-6 text-white">
            <p className="eyebrow text-white/45">What to expect</p>
            <ol className="mt-4 space-y-3">
              {[
                [Phone, 'One of us gets back to you to talk it through'],
                [Droplet, 'We go through your feed water and daily volume'],
                [Wrench, 'A quotation for the model that fits'],
              ].map(([Icon, text]) => (
                <li key={text} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/70">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10">
                    <Icon size={14} />
                  </span>
                  <span className="pt-1">{text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-[12.5px] leading-relaxed text-white/45">
              <Pin size={14} className="mt-0.5 shrink-0" />
              {company.address.line1}, {company.address.city} {company.address.pin}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-muted-2">{label}</span>
      <input className="field" {...props} />
    </label>
  )
}
