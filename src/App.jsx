import { Navigate, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer, { Toast } from './components/CartDrawer'
import { useReveal, useScrollTop } from './lib/useReveal'

import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Compare from './pages/Compare'
import Accessories from './pages/Accessories'
import Videos from './pages/Videos'
import Technology from './pages/Technology'
import Support from './pages/Support'
import About from './pages/About'
import Quote from './pages/Quote'
import NotFound from './pages/NotFound'

export default function App() {
  useScrollTop()
  useReveal()

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-black"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/p/:slug" element={<Product />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
          <Route path="/quote" element={<Quote />} />
          {/* the storefront used to check out; enquiries replaced it */}
          <Route path="/checkout" element={<Navigate to="/quote" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  )
}
