/**
 * Product photography, taken from the client's own V-Tech Aqua catalogue.
 * The source scans sit on slightly different backgrounds, so every shot is
 * framed inside a neutral plate and contained rather than cropped — nothing
 * is ever cut off, whatever the aspect ratio of the original.
 */
export default function ProductImage({
  product,
  className = '',
  imgClassName = '',
  plate = 'water-field',
  sizes = '(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 340px',
  priority = false,
}) {
  return (
    <div className={`relative overflow-hidden ${plate} ${className}`}>
      <img
        src={product.image}
        alt={`${product.name}${product.variant ? ` — ${product.variant}` : ''}, ${product.sectionLabel}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        className={`absolute inset-0 h-full w-full object-contain p-[6%] mix-blend-multiply ${imgClassName}`}
      />
    </div>
  )
}
