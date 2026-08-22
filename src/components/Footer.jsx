import { Link } from 'react-router-dom'
import { bySection, company, sections } from '../data/products'
import { whatsappLink } from '../lib/format'
import { LogoLockup } from './Logo'
import { ArrowRight, Phone, Pin, Shield } from './Icons'

const COMPANY_LINKS = [
  ['About us', '/about'],
  ['How RO works', '/technology'],
  ['Accessories & spares', '/accessories'],
  ['Videos', '/videos'],
  ['Compare models', '/compare'],
  ['Service & support', '/support'],
  ['Request a quotation', '/quote'],
]

export default function Footer() {
  const { address } = company

  return (
    <footer className="border-t border-line bg-white">
      {/* talk-to-us band */}
      <div className="shell py-14 md:py-20">
        <div className="canvas ink-field px-6 py-12 text-white md:px-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow text-white/45">Talk to us</p>
              <h2 className="display-3 mt-4 max-w-md text-white">
                Tell us your daily requirement.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
                Domestic cabinet or a 3000 LPH plant — the conversation starts the same way, with
                your feed water and how many litres a day you need.
              </p>
              <Link to="/quote" className="btn mt-7 bg-white text-ink hover:bg-glow">
                Request a quotation <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-3 md:justify-self-end md:w-full md:max-w-sm">
              {company.contacts.map((c) => (
                <a
                  key={c.phone}
                  href={whatsappLink(c.phone, `Hello ${c.name.split(' ')[0]}, I would like to enquire about an RO system.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-4 transition-colors hover:border-white/40"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-[15px] font-semibold">{c.name}</span>
                    <span className="block text-[13px] text-white/55">Call or WhatsApp</span>
                  </span>
                  <span className="shrink-0 font-display text-[15px] font-bold text-glow">
                    {c.display}
                  </span>
                </a>
              ))}
              <p className="mt-1 flex items-center gap-2 text-[12.5px] text-white/40">
                <Shield size={14} /> {company.certification} certified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* link columns */}
      <div className="shell grid gap-10 border-t border-line py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div className="lg:pr-8">
          <LogoLockup className="h-14" alt="Maruti Water Solution" />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-muted">
            Clean water for homes, shops and plants. The V-Tech Aqua range of RO systems, from
            12-litre domestic cabinets to 3000 LPH plants.
          </p>
          <address className="mt-5 flex gap-2.5 text-[13.5px] leading-relaxed text-muted not-italic">
            <Pin size={16} className="mt-0.5 shrink-0 text-blue" />
            <span>
              {address.line1}
              <br />
              {address.line2}
              <br />
              {address.city} {address.pin}, {address.state}
            </span>
          </address>
          <div className="mt-4 space-y-1.5">
            {company.contacts.map((c) => (
              <a
                key={c.phone}
                href={`tel:+${c.phone}`}
                className="flex items-center gap-2.5 text-[13.5px] text-muted transition-colors hover:text-ink"
              >
                <Phone size={15} className="shrink-0 text-blue" />
                <span className="font-medium text-ink">{c.display}</span>
                <span className="text-muted-2">{c.name.split(' ')[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {sections.map((s) => (
          <nav key={s.id} aria-label={s.label}>
            <h3 className="eyebrow mb-4 text-muted-2">{s.label}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to={`/shop?c=${s.id}`}
                  className="link-underline text-[14px] font-medium text-ink"
                >
                  All {bySection(s.id).length} models
                </Link>
              </li>
              {bySection(s.id)
                .slice(0, 5)
                .map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/p/${p.slug}`}
                      className="link-underline text-[14px] text-muted hover:text-ink"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Company">
          <h3 className="eyebrow mb-4 text-muted-2">Company</h3>
          <ul className="space-y-2.5">
            {COMPANY_LINKS.map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="link-underline text-[14px] text-muted hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* legal bar */}
      <div className="border-t border-line">
        <div className="shell flex flex-col gap-3 py-6 text-[12.5px] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}, {address.city}. All rights reserved.
          </p>
          <p className="text-muted-2">
            Product specifications and M.R.P. as printed in the V-Tech Aqua 2023 catalogue. Prices
            and specifications are subject to change without notice.
          </p>
        </div>
      </div>
    </footer>
  )
}
