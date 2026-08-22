import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { videoEmbedUrl } from '../data/videos'
import { products } from '../data/products'
import { ArrowRight, Close } from './Icons'

/**
 * Lightbox player.
 *
 * The player element is mounted only while a video is open and unmounted the
 * moment it closes — that is what actually stops playback and stops the audio,
 * and it is why nothing is ever fetched from YouTube until a visitor presses
 * play. `video` being null renders nothing at all.
 */
export default function VideoModal({ video, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const restoreRef = useRef(null)

  const open = Boolean(video)

  /* Escape closes, wherever focus happens to be. */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /* Lock the page behind the dialog. */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  /* Move focus in on open and hand it back to the card on close, so keyboard
     users do not get dropped at the top of the document. */
  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement
    const t = setTimeout(() => closeRef.current?.focus(), 60)
    return () => {
      clearTimeout(t)
      const back = restoreRef.current
      // body is not focusable, so restoring to it would strand focus at the
      // top of the document rather than back on the card.
      if (back && back !== document.body && document.contains(back)) back.focus()
    }
  }, [open])

  /* Keep Tab inside the dialog. */
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return
    const nodes = panelRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])',
    )
    if (!nodes || nodes.length === 0) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!open) return null

  const embed = videoEmbedUrl(video)
  const linked = video.product ? products.find((p) => p.id === video.product) : null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onKeyDown={onKeyDown}
    >
      {/* Click-outside. A sibling overlay rather than a wrapper, so a click that
          starts on the video and drags off it cannot close the dialog. */}
      <button
        type="button"
        aria-label="Close video"
        tabIndex={-1}
        onClick={onClose}
        className="video-scrim absolute inset-0 cursor-default bg-ink/80 backdrop-blur-md"
      />

      <div ref={panelRef} className="video-panel relative z-10 w-full max-w-5xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate font-display text-[17px] font-semibold text-white sm:text-[19px]">
              {video.title}
            </h2>
            {video.description && (
              <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-white/55">
                {video.description}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink"
            aria-label="Close video"
          >
            <Close size={20} />
          </button>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-2xl">
          {video.source === 'youtube' && embed ? (
            <iframe
              src={embed}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <video
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>

        {linked && (
          <div className="mt-3 flex justify-end">
            <Link
              to={`/p/${linked.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/70 transition-colors hover:text-white"
            >
              View {linked.name} <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
