import { products } from './products'

/* ============================================================
   Product groups — one physical model, many grades.

   The catalogue lists each grade as its own model (Zuric Platinum,
   Zuric Gold, Zuric Silver…), but they are one cabinet with different
   filter stacks. Rendering them as three cards repeats the same
   photograph three times.

   The grouping key is the product photograph: two models that ship the
   same physical unit share an image, and nothing else in the data
   distinguishes a "family" as reliably. Models with genuinely different
   photographs — the open-frame and cabinet 15 LPH systems, every plant —
   stay as separate cards, which is correct.

   Nothing here invents data: a group is a view over the same product
   objects, so price, specs, slug, id and routing are untouched.
   ============================================================ */

/**
 * Splits a family's names into the part they share (the card title) and the
 * part that differs (the grade label), working from whichever end is common:
 *
 *   Zuric Platinum / Zuric Gold      -> "Zuric"           + Platinum / Gold
 *   15 L Pressure Tank RO / 25 L …   -> "Pressure Tank RO" + 15 L / 25 L
 */
function splitNames(names) {
  const words = names.map((n) => n.trim().split(/\s+/))
  const shortest = Math.min(...words.map((w) => w.length))

  let pre = 0
  while (pre < shortest && words.every((w) => w[pre] === words[0][pre])) pre++

  let suf = 0
  const tailAt = (w, k) => w[w.length - 1 - k]
  while (suf < shortest - pre && words.every((w) => tailAt(w, suf) === tailAt(words[0], suf))) suf++

  // A label must not decay to a bare number: "15 L Pressure Tank RO" shares the
  // "L" with "25 L …", which would leave the labels as "15" and "25" and push
  // the unit into the title. Give the unit back to the label.
  const labelAt = (i) => words[i].slice(pre, words[i].length - suf).join(' ')
  while (suf > 0 && names.some((_, i) => /^\d[\d,]*$/.test(labelAt(i)))) suf--

  const title = pre > 0 ? words[0].slice(0, pre).join(' ') : words[0].slice(words[0].length - suf).join(' ')

  return { title, labels: names.map((_, i) => labelAt(i)) }
}

function toGroup(members) {
  const first = members[0]
  const multi = members.length > 1

  let title = first.name
  let labels = members.map((p) => p.variant || p.name)

  if (multi) {
    const split = splitNames(members.map((p) => p.name))
    // Only take the derived title if it left every grade with a real label.
    if (split.title && split.labels.every(Boolean)) {
      title = split.title
      labels = split.labels
    } else {
      title = first.series || first.name
    }
  }

  return {
    // stable across renders and unique per card
    id: `${first.section}-${first.image.replace(/^.*\//, '').replace(/\.\w+$/, '')}`,
    section: first.section,
    sectionLabel: first.sectionLabel,
    series: first.series,
    image: first.image,
    name: title,
    isFamily: multi,
    variants: members.map((p, i) => ({ product: p, label: labels[i] })),
  }
}

/** Groups a list of products, preserving catalogue order. */
export function groupProducts(list) {
  const buckets = new Map()
  for (const p of list) {
    const key = `${p.section}|${p.image}`
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(p)
  }
  return [...buckets.values()].map(toGroup)
}

export const productGroups = groupProducts(products)

export const groupsBySection = (id) => productGroups.filter((g) => g.section === id)

/** The group a given product belongs to — used to exclude it from "related". */
export const groupOfProduct = (product) =>
  productGroups.find((g) => g.variants.some((v) => v.product.id === product.id))
