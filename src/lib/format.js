const inrFmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const inr = (n) => inrFmt.format(n)

/** Several catalogue models are printed without a figure — never invent one. */
export const priceLabel = (price) =>
  typeof price === 'number' ? inr(price) : 'Price on request'

export const compact = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n)

/** Builds a wa.me link with a pre-filled message. */
export function whatsappLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
