import ProductImage from './ProductImage'
import { glyphFor } from './AccessoryCard'

/**
 * Thumbnail for one line of the enquiry list.
 *
 * The list holds two kinds of thing. Systems have a catalogue photograph;
 * spare parts do not, and they carry no `image` or `sectionLabel` either — so
 * handing one to ProductImage renders a broken `img` whose alt text reads
 * "Alkaline Filter, undefined". Every place that draws an enquiry line goes
 * through here so that can only be got right once.
 */
export default function EnquiryThumb({ item, className = '', sizes = '96px' }) {
  if (item.kind === 'accessory') {
    const Glyph = glyphFor(item.category)
    return (
      <span className={`part-plate grid ${className}`} role="img" aria-label={item.name}>
        <Glyph size={26} className="part-glyph" />
      </span>
    )
  }
  return <ProductImage product={item} className={className} sizes={sizes} />
}
