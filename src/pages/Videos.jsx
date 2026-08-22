import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { activeCategories, videos, videoThumb } from '../data/videos'
import { company } from '../data/products'
import { whatsappLink } from '../lib/format'
import VideoModal from '../components/VideoModal'
import { ArrowRight, Phone, Play } from '../components/Icons'

export default function Videos() {
  const [cat, setCat] = useState('all')
  const [playing, setPlaying] = useState(null)

  const cats = useMemo(() => activeCategories(), [])
  const list = useMemo(
    () => (cat === 'all' ? videos : videos.filter((v) => v.category === cat)),
    [cat],
  )

  const primary = company.contacts[0]

  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="shell py-14 md:py-20">
          <p className="eyebrow text-muted-2">Video</p>
          {/* Only claim there is footage when there is — headline included. With an
              empty gallery both would be describing videos that do not exist. */}
          <h1 className="display-1 mt-4 max-w-3xl">
            {videos.length > 0 ? 'See the systems running' : 'Video'}
          </h1>
          {videos.length > 0 && (
            <p className="lede mt-5 max-w-xl">
              Walkthroughs, installations and servicing, filmed on the actual units.
            </p>
          )}
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        {videos.length === 0 ? (
          <EmptyState primary={primary} />
        ) : (
          <>
            {cats.length > 1 && (
              <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-1">
                <FilterChip active={cat === 'all'} onClick={() => setCat('all')}>
                  All videos
                </FilterChip>
                {cats.map((c) => (
                  <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                    {c.label}
                  </FilterChip>
                ))}
              </div>
            )}

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((v) => (
                <li key={v.id} className="reveal">
                  <VideoCard video={v} onPlay={() => setPlaying(v)} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`chip shrink-0 whitespace-nowrap transition-colors ${
        active
          ? 'border-transparent bg-white text-black'
          : 'border-line bg-white/5 text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function VideoCard({ video, onPlay }) {
  const thumb = videoThumb(video)

  return (
    <button
      onClick={onPlay}
      className="video-card group block w-full text-left"
      aria-label={`Play video: ${video.title}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-3xl water-field">
        {thumb ? (
          /* Lazy — the grid never fetches a still until it scrolls near, and it
             never touches the video itself. */
          <img
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: 'var(--ease-out-quint)' }}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-2">
            <Play size={40} />
          </div>
        )}

        <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-black/30" />

        <span className="video-play absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-black shadow-xl">
          <Play size={22} className="ml-0.5" />
        </span>

        {video.duration && (
          <span className="absolute right-3 bottom-3 rounded-full bg-black/80 px-2.5 py-1 font-display text-[12px] font-semibold text-white tabular-nums">
            {video.duration}
          </span>
        )}
      </div>

      <h2 className="mt-4 font-display text-[16px] leading-snug font-semibold">{video.title}</h2>
      {video.description && (
        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted">
          {video.description}
        </p>
      )}
    </button>
  )
}

/**
 * Shown because the gallery is genuinely empty — see the note at the top of
 * `src/data/videos.js`. It points at the things that *do* exist rather than
 * promising a library that has not been filmed.
 */
function EmptyState({ primary }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-full water-field text-muted-2">
        <Play size={34} />
      </div>
      <h2 className="mt-7 font-display text-[24px] font-semibold">No videos here yet</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Nothing has been filmed for the site so far. Every model does carry its full
        catalogue specification on its own page, and we can talk you through any system
        directly.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link to="/shop" className="btn-dark btn-sm">
          Browse the range <ArrowRight size={16} />
        </Link>
        <a
          href={whatsappLink(
            primary.phone,
            'Hello Maruti Water Solution, could you walk me through one of your systems?',
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost btn-sm"
        >
          <Phone size={15} /> Ask on WhatsApp
        </a>
      </div>
    </div>
  )
}
