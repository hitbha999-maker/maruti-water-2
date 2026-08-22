import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'

const StoreCtx = createContext(null)

const KEY_CART = 'mws.enquiry.v1'
const KEY_COMPARE = 'mws.compare.v1'

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [lines, setLines] = useState(() => read(KEY_CART, []))
  const [compare, setCompare] = useState(() => read(KEY_COMPARE, []))
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem(KEY_CART, JSON.stringify(lines))
  }, [lines])

  useEffect(() => {
    localStorage.setItem(KEY_COMPARE, JSON.stringify(compare))
  }, [compare])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const add = useCallback((id, qty = 1, opts = {}) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.id === id)
      if (hit) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
      return [...prev, { id, qty }]
    })
    if (!opts.silent) setCartOpen(true)
    const item = products.find((p) => p.id === id)
    setToast(item ? `${item.name} added to your enquiry` : 'Added to your enquiry')
  }, [])

  const setQty = useCallback((id, qty) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    )
  }, [])

  const remove = useCallback((id) => setLines((prev) => prev.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const toggleCompare = useCallback((id) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) {
        setToast('Compare holds three products - remove one first')
        return prev
      }
      setToast('Added to compare')
      return [...prev, id]
    })
  }, [])

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const item = products.find((p) => p.id === l.id)
          return item ? { ...l, item } : null
        })
        .filter(Boolean),
    [lines],
  )

  /* Several catalogue models are printed without an M.R.P. They must never be
     silently totalled as zero — they are counted separately and the estimate is
     shown as a "from" figure whenever any of them are in the list. */
  const subtotal = useMemo(
    () =>
      detailed.reduce((s, l) => (typeof l.item.price === 'number' ? s + l.item.price * l.qty : s), 0),
    [detailed],
  )
  const quoteOnly = useMemo(() => detailed.filter((l) => l.item.price == null), [detailed])
  const count = useMemo(() => detailed.reduce((s, l) => s + l.qty, 0), [detailed])

  const value = {
    lines: detailed,
    subtotal,
    quoteOnly,
    count,
    add,
    setQty,
    remove,
    clear,
    cartOpen,
    setCartOpen,
    compare,
    toggleCompare,
    clearCompare: () => setCompare([]),
    toast,
    setToast,
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
