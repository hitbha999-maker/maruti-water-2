import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { inr, priceLabel, whatsappLink } from '../lib/format'
import { company } from '../data/products'
import EnquiryThumb from './EnquiryThumb'
import { LogoMark } from './Logo'
import { ArrowRight, Check, Close, Minus, Phone, Plus } from './Icons'

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, remove, subtotal, quoteOnly } = useStore()

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCartOpen])

  const primary = company.contacts[0]
  const waMessage = lines.length
    ? `Hello Maruti Water Solution, I would like a quotation for:\n${lines
        .map((l) => `• ${l.item.name}${l.item.variant ? ` (${l.item.variant})` : ''} × ${l.qty}`)
        .join('\n')}`
    : 'Hello Maruti Water Solution, I would like a quotation.'

  return (
    <div
      className={`fixed inset-0 z-[70] ${cartOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!cartOpen}
      inert={!cartOpen || undefined}
    >
      <div
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          cartOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-label="Enquiry list"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-line bg-graphite shadow-2xl transition-transform duration-500 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
      >
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="font-display text-[18px] font-semibold">
            Your enquiry{' '}
            <span className="text-muted-2">({lines.reduce((s, l) => s + l.qty, 0)})</span>
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist"
            aria-label="Close enquiry list"
          >
            <Close size={22} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full water-field">
              <LogoMark className="h-9 w-[72px]" />
            </div>
            <div>
              <p className="font-display text-[20px] font-semibold">Nothing added yet</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                Add the models you are considering and send them across in one enquiry — we
                will come back on all of them together.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-dark btn-sm">
                Browse the range
              </Link>
              <Link to="/#finder" onClick={() => setCartOpen(false)} className="btn-ghost btn-sm">
                Help me choose
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="space-y-4">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-4">
                    {/* Spare parts have no catalogue photograph and no product
                        page of their own, so the thumbnail becomes the category
                        glyph and the link points back at the accessories grid. */}
                    <Link
                      to={
                        l.item.kind === 'accessory'
                          ? `/accessories#${l.item.id}`
                          : `/p/${l.item.slug}`
                      }
                      onClick={() => setCartOpen(false)}
                      className="shrink-0"
                    >
                      <EnquiryThumb
                        item={l.item}
                        className="h-24 w-24 rounded-2xl"
                        sizes="96px"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display text-[15px] font-semibold">
                            {l.item.name}
                          </p>
                          <p className="truncate text-[12.5px] text-muted">
                            {l.item.variant || l.item.configuration}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(l.id)}
                          className="shrink-0 text-[12.5px] text-muted-2 underline decoration-line underline-offset-2 hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            onClick={() => setQty(l.id, l.qty - 1)}
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-mist"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-display text-[13.5px] font-semibold">
                            {l.qty}
                          </span>
                          <button
                            onClick={() => setQty(l.id, l.qty + 1)}
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-mist"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right font-display text-[15px] font-bold">
                          {typeof l.item.price === 'number'
                            ? inr(l.item.price * l.qty)
                            : priceLabel(l.item.price)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="shrink-0 border-t border-line p-5">
              <dl className="space-y-1.5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Catalogue M.R.P.</dt>
                  <dd className="font-display text-[19px] font-bold">
                    {quoteOnly.length ? `From ${inr(subtotal)}` : inr(subtotal)}
                  </dd>
                </div>
              </dl>

              <p className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-muted">
                <Check size={14} className="mt-0.5 shrink-0 text-blue" />
                {quoteOnly.length > 0
                  ? `${quoteOnly.length} item${quoteOnly.length === 1 ? '' : 's'} in this list has no printed rate — we will price it in the quotation.`
                  : 'Inclusive of taxes. Installation and any pre-treatment are quoted after a site check.'}
              </p>

              <Link to="/quote" onClick={() => setCartOpen(false)} className="btn-primary mt-4 w-full">
                Request a quotation <ArrowRight size={17} />
              </Link>
              <a
                href={whatsappLink(primary.phone, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost btn-sm mt-2 w-full"
              >
                <Phone size={15} /> Send on WhatsApp
              </a>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export function Toast() {
  const { toast } = useStore()
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 transition-all duration-400 ${
        toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
      style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
    >
      <div className="flex items-center gap-2.5 rounded-full bg-steel px-5 py-3 text-[14px] font-medium text-white shadow-xl">
        <Check size={16} className="text-aqua-2" />
        {toast}
      </div>
    </div>
  )
}
