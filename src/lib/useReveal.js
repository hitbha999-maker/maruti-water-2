import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Adds `.is-in` to every `.reveal` as it scrolls into view.
 *
 * Filtering the shop, switching a tab or opening the mega menu all mount fresh
 * `.reveal` nodes long after this effect first ran. Those nodes are never
 * intersected by an observer that only saw the initial DOM, so they would sit
 * at opacity:0 while remaining fully interactive — visible to the layout and to
 * assistive tech, but invisible on screen. A MutationObserver picks them up.
 */
export function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((n) => n.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    // Re-observing an element already being observed is a no-op, so this is
    // safe to call as often as the DOM changes.
    const observeAll = () =>
      document.querySelectorAll('.reveal:not(.is-in)').forEach((n) => io.observe(n))

    observeAll()

    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
}

/**
 * Scroll to top on navigation. When the URL carries a hash, scroll to that
 * element instead — the target often mounts a frame or two after the route
 * change, so retry briefly before giving up.
 */
export function useScrollTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }

    let frames = 0
    let raf = 0
    const tryScroll = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (frames++ < 40) raf = requestAnimationFrame(tryScroll)
    }
    raf = requestAnimationFrame(tryScroll)
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])
}
