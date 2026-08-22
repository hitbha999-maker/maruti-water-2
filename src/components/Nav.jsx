import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { bySection, company, sections } from '../data/products'
import { priceLabel, whatsappLink } from '../lib/format'
import Logo from './Logo'
import ProductImage from './ProductImage'
import { ArrowRight, Bag, Close, Menu, Phone, Scale } from './Icons'

const NAV = [
  { label: 'Domestic', to: '/shop?c=domestic', section: 'domestic' },
  { label: 'Commercial', to: '/shop?c=commercial', section: 'commercial' },
  { label: 'Industrial', to: '/shop?c=industrial', section: 'industrial' },
  { label: 'Support', to: '/support' },
  { label: 'About', to: '/about' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [openMega, setOpenMega] = useState(null)
  const [mobile, setMobile] = useState(false)
  const { count, setCartOpen, compare } = useStore()
  const { pathname, search } = useLocation()
  const closeTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobile(false)
    setOpenMega(null)
  }, [pathname, search])

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenMega(null)
        setMobile(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const hoverIn = (s) => {
    clearTimeout(closeTimer.current)
    setOpenMega(s)
  }
  const hoverOut = () => {
    closeTimer.current = setTimeout(() => setOpenMega(null), 160)
  }

  const solid = scrolled || openMega
  const megaSection = sections.find((s) => s.id === openMega)
  const megaItems = openMega ? bySection(openMega) : []
  const primary = company.contacts[0]

  return (
    <>
      {/* announcement rail */}
      <div className="relative z-50 bg-ink text-white">
        <div className="shell flex h-9 items-center justify-center gap-3 overflow-hidden text-[12.5px] font-medium">
          <span className="hidden sm:inline text-white/55">{company.certification} certified</span>
          <span className="hidden sm:inline text-white/25">·</span>
          <span className="text-white/55">
            {company.address.city}, {company.address.state}
          </span>
          <span className="text-white/25">·</span>
          <a
            href={`tel:+${primary.phone}`}
            className="link-underline text-white hover:text-glow"
          >
            {primary.display}
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          solid
            ? 'border-b border-line bg-white/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
              {NAV.map((n) => (
                <div
                  key={n.label}
                  onMouseEnter={n.section ? () => hoverIn(n.section) : () => setOpenMega(null)}
                  onMouseLeave={n.section ? hoverOut : undefined}
                  onFocus={n.section ? () => hoverIn(n.section) : () => setOpenMega(null)}
                  onBlur={n.section ? hoverOut : undefined}
                >
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `relative rounded-full px-3.5 py-2 font-display text-[14.5px] font-medium transition-colors duration-200 ${
                        (isActive && !n.section) || openMega === n.section
                          ? 'text-ink'
                          : 'text-muted hover:text-ink'
                      }`
                    }
                  >
                    {n.label}
                    {openMega === n.section && (
                      <span className="absolute inset-x-3.5 -bottom-px h-px bg-ink" />
                    )}
                  </NavLink>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={whatsappLink(primary.phone, 'Hello, I would like to enquire about an RO system.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-medium text-muted transition-colors hover:text-ink xl:flex"
            >
              <Phone size={16} /> WhatsApp
            </a>

            {compare.length > 0 && (
              <Link
                to="/compare"
                className="relative hidden items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[13.5px] font-semibold sm:flex"
              >
                <Scale size={16} /> {compare.length}
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-mist"
              aria-label={`Open enquiry list, ${count} item${count === 1 ? '' : 's'}`}
            >
              <Bag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-blue px-1 font-display text-[10.5px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            <Link to="/quote" className="btn-primary btn-sm ml-1 hidden md:inline-flex">
              Get a quote
            </Link>

            <button
              onClick={() => setMobile(true)}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* ---------- mega menu ---------- */}
        <div
          onMouseEnter={() => hoverIn(openMega)}
          onMouseLeave={hoverOut}
          aria-hidden={openMega ? undefined : 'true'}
          inert={openMega ? undefined : true}
          className={`absolute inset-x-0 top-full origin-top overflow-hidden border-b border-line bg-white transition-all duration-400 ${
            openMega
              ? 'pointer-events-auto max-h-[620px] opacity-100'
              : 'pointer-events-none max-h-0 opacity-0'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
        >
          {/* Rendered only while open. A collapsed panel that still holds markup
              leaks its text into the accessibility tree and to crawlers — the
              empty state read as a stray "· 0 models / View all". */}
          <div className="shell py-8" hidden={!openMega}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="eyebrow text-blue-ink">{megaSection?.label}</p>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
                  {megaSection?.tagline} · {megaItems.length} models
                </p>
              </div>
              <Link to={`/shop?c=${openMega}`} className="btn-ghost btn-sm">
                View all {megaSection?.label} <ArrowRight size={15} />
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-3 xl:grid-cols-4">
              {megaItems.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/p/${p.slug}`}
                    className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-mist"
                  >
                    <ProductImage
                      product={p}
                      className="h-12 w-12 shrink-0 rounded-xl"
                      sizes="48px"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[14px] font-semibold">
                        {p.name}
                      </span>
                      <span className="block truncate text-[12.5px] text-muted">
                        {p.variant || p.configuration} · {priceLabel(p.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* ---------- mobile sheet ---------- */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${mobile ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobile}
        inert={!mobile || undefined}
      >
        <div
          onClick={() => setMobile(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-400 ${
            mobile ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white transition-transform duration-500 ${
            mobile ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
            <Logo />
            <button
              onClick={() => setMobile(false)}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist"
              aria-label="Close menu"
            >
              <Close size={22} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className="flex items-center justify-between border-b border-line py-4 font-display text-[21px] font-semibold"
              >
                {n.label}
                <ArrowRight size={20} className="text-muted-2" />
              </Link>
            ))}

            <div className="mt-8 space-y-3 rounded-2xl bg-mist p-4">
              <p className="eyebrow text-muted-2">Talk to us</p>
              {company.contacts.map((c) => (
                <a
                  key={c.phone}
                  href={`tel:+${c.phone}`}
                  className="flex items-center justify-between gap-3 text-[14.5px]"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="font-display font-semibold text-blue-ink">{c.display}</span>
                </a>
              ))}
            </div>
          </nav>

          <div className="shrink-0 border-t border-line p-5">
            <Link to="/quote" className="btn-primary w-full">
              Get a quote
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
