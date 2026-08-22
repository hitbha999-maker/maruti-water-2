import { Link } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { ArrowRight } from '../components/Icons'

export default function NotFound() {
  return (
    <section className="shell py-20 md:py-28">
      <div className="canvas ink-field grid place-items-center px-6 py-20 text-center">
        <span className="grid h-24 w-24 place-items-center rounded-3xl bg-white/8">
          <LogoMark className="h-9 w-[72px]" invert />
        </span>
        <p className="eyebrow mt-6 text-blue-ink">404</p>
        <h1 className="display-2 mt-4 max-w-[18ch]">This page ran dry.</h1>
        <p className="lede mt-5 max-w-md !text-ink/65">
          The link is broken or the model has been retired. The full range is one click away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            See the range <ArrowRight size={17} />
          </Link>
          <Link to="/" className="btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </section>
  )
}
