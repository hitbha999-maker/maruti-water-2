/**
 * Video gallery.
 *
 * THIS LIST IS EMPTY ON PURPOSE. The project shipped with no video files and no
 * video links anywhere in the catalogue, the assets or the source — so there is
 * nothing real to show yet, and a demo reel of invented YouTube ids would put
 * dead links on a real dealer's website. The gallery, the modal player and the
 * lazy thumbnails are all built and working; they light up the moment a genuine
 * entry is added below.
 *
 * To add one, append an object:
 *
 *   {
 *     id: 'zuric-install',              // unique, kebab-case
 *     title: 'Zuric Platinum installation',
 *     description: 'Wall mounting, inlet tap-off and first flush.',
 *     category: 'installation',         // must match a CATEGORIES id below
 *     source: 'youtube',                // 'youtube' | 'file'
 *     youtubeId: 'dQw4w9WgXcQ',         // youtube only — the id, not the URL
 *     duration: '4:12',                 // optional, as printed on the video
 *     product: 'zuric-platinum',        // optional product id — links the card
 *   }
 *
 * For a self-hosted clip instead, drop the file in `public/videos/` and use:
 *
 *   { …, source: 'file', src: '/videos/clip.mp4', poster: '/videos/clip.jpg' }
 *
 * A poster is optional; without one the card shows the category glyph rather
 * than pulling the first frame, so the video file itself is never fetched until
 * the visitor presses play.
 */
export const videos = []

/** Only categories that actually have a video are ever rendered. */
export const CATEGORIES = [
  { id: 'product', label: 'Product overviews' },
  { id: 'installation', label: 'Installation' },
  { id: 'maintenance', label: 'Servicing & cartridges' },
  { id: 'plant', label: 'Plants in operation' },
]

export const hasVideos = videos.length > 0

/**
 * Thumbnail for a card. YouTube serves stills off its image CDN, so no API key
 * and no player script is needed to draw the grid — hqdefault exists for every
 * video, unlike maxresdefault which 404s on anything not uploaded in HD.
 */
export function videoThumb(v) {
  if (v.source === 'youtube' && v.youtubeId) {
    return `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`
  }
  return v.poster || null
}

/**
 * The player URL, built only when the modal opens. `autoplay=1` is safe here
 * because the visitor pressed play; `rel=0` keeps the end screen on this
 * channel; `modestbranding=1` drops the watermark.
 */
export function videoEmbedUrl(v) {
  if (v.source !== 'youtube' || !v.youtubeId) return null
  const q = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${v.youtubeId}?${q}`
}

export const videosByCategory = (id) =>
  id === 'all' ? videos : videos.filter((v) => v.category === id)

/** Categories that have at least one video, in the order declared above. */
export const activeCategories = () =>
  CATEGORIES.filter((c) => videos.some((v) => v.category === c.id))
