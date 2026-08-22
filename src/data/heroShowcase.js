import { getProduct, sections } from './products'

/* ============================================================
   Homepage hero showcase — one flagship per product category.

   To change what the hero shows for a category, swap the slug.
   To add a category, add it to `sections` in products.js and add
   its flagship slug here; the carousel picks it up automatically
   and keeps the catalogue order.

   Slugs must exist in products.js — anything unresolved is dropped
   rather than rendered as a blank slide.
   ============================================================ */
export const HERO_FLAGSHIPS = {
  domestic: 'zuric-platinum',
  commercial: 'plant-150',
  industrial: 'plant-1000-auto',
}

export const heroProducts = sections
  .map((section) => {
    const product = getProduct(HERO_FLAGSHIPS[section.id])
    return product ? { section, product } : null
  })
  .filter(Boolean)
