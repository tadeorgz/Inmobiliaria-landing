import { useMemo, useState, useEffect } from 'react'
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
import AboutUs from './components/AboutUs'
import CategoryFilter from './components/CategoryFilter'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import PropertiesListing from './components/PropertiesListing'
import QueIncluye from './components/QueIncluye'
import PropertyDetails from './components/PropertyDetails'
import ProtectedRoute from './components/ProtectedRoute'
import { siteConfig } from './config/siteConfig'
import AccountPage from './pages/AccountPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminPropiedadFormPage from './pages/AdminPropiedadFormPage'
import AdminPropiedadesPage from './pages/AdminPropiedadesPage'
import LoginPage from './pages/LoginPage'
import { getPropiedadesPublicas } from './services/publicPropiedades'
import { createWhatsAppLink } from './utils/whatsapp'

function LandingPage() {
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Fetch de propiedades publicas (no requiere sesion)
  useEffect(() => {
    const loadPropiedades = async () => {
      setLoading(true)
      const data = await getPropiedadesPublicas()
      setPropiedades(data)
      setLoading(false)
    }
    loadPropiedades()
  }, [])

  const isPropertiesPage = location.pathname === '/propiedades'

  const navLinks = isPropertiesPage
    ? [
      { label: 'Volver al inicio', href: '/#propiedades' },
      { label: 'Admin', href: '/admin' },
      { label: 'Contacto', href: '#contacto' },
    ]
    : [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Propiedades', href: '#propiedades' },
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Admin', href: '/admin' },
      { label: 'Contacto', href: '#contacto' },
    ]

  const categories = useMemo(
    () => ['Todas', ...new Set(propiedades.map((prop) => prop.tipo))],
    [propiedades],
  )

  const filteredProducts = useMemo(() => {
    return propiedades.filter((prop) => {
      const query = search.toLowerCase().trim()
      const matchBySearch =
        prop.nombre.toLowerCase().includes(query) ||
        prop.descripcion.toLowerCase().includes(query) ||
        prop.zona.toLowerCase().includes(query) ||
        prop.tipo.toLowerCase().includes(query)
      const matchByCategory = selectedCategory === 'Todas' || prop.tipo === selectedCategory
      return matchBySearch && matchByCategory
    })
  }, [search, selectedCategory, propiedades])

  const handleSearchChange = (value) => {
    setSearch(value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const ctaHref = createWhatsAppLink(siteConfig.whatsappNumber, siteConfig.ctaMessage)
  const heroSubtext = "Casas · Departamentos • " + siteConfig.address
  const featuredProperties = filteredProducts.slice(0, 6)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let attempts = 0
    const maxAttempts = 12

    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      attempts += 1
      if (attempts <= maxAttempts) {
        setTimeout(scrollToHash, 100)
      }
    }

    scrollToHash()
    const onHashChange = () => {
      attempts = 0
      scrollToHash()
    }
    window.addEventListener('hashchange', onHashChange, { passive: true })

    return () => window.removeEventListener('hashchange', onHashChange)
  }, [location.hash])

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <span className="mb-3 text-4xl">🏠</span>
      <p className="font-semibold text-slate-700">Sin resultados</p>
      <p className="mt-1 text-sm text-slate-500">No encontramos propiedades con esa búsqueda.</p>
      <button
        type="button"
        onClick={() => {
          setSearch('')
          setSelectedCategory('Todas')
        }}
        className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      >
        Limpiar filtros
      </button>
    </div>
  )

  return (
    <>
      <Navbar
        companyName={siteConfig.companyName}
        navLinks={navLinks}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      />

      <main>
        {loading ? (
          <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-600">Cargando propiedades...</p>
            </div>
          </section>
        ) : isPropertiesPage ? (
          <>
            <Hero
              title="Catálogo completo de propiedades"
              ctaLabel={siteConfig.ctaLabel}
              ctaHref={ctaHref}
              backgroundImage="hero-bg.png"
            />
            <div className="relative z-10 bg-slate-50">
              <CategoryFilter
                search={search}
                onSearchChange={handleSearchChange}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                {filteredProducts.length === 0 ? (
                  emptyState
                ) : (
                  <PropertiesListing
                    properties={filteredProducts}
                    companyName={siteConfig.companyName}
                    whatsappNumber={siteConfig.whatsappNumber}
                    variant="grid"
                  />
                )}
                <div className="mt-8 flex justify-center">
                  {/* <a
                    href="/#propiedades"
                    aria-label="Volver al inicio"
                    className="mx-auto inline-block rounded-lg bg-[var(--brand-color)] px-4 py-2 text-sm font-medium text-white shadow transition transform hover:scale-105 hover:bg-[var(--brand-dark-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-color)]"
                    onClick={(e) => {
                      e.preventDefault()
                      setSearch('')
                      setSelectedCategory('Todas')
                      window.location.hash = '#propiedades'
                    }}
                  >
                    Volver al inicio
                  </a> */}
                  <Link
                    to="/#propiedades"
                    onClick={() => {
                      setSearch('')
                      setSelectedCategory('Todas')
                    }}
                    className="mx-auto inline-block rounded-lg bg-[var(--brand-color)] px-4 py-2 text-sm font-medium text-white shadow transition transform hover:scale-105 hover:bg-[var(--brand-dark-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-color)]"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </section>
            </div>
          </>
        ) : (
          <>
            <Hero
              title={siteConfig.heroTitle}
              description={siteConfig.heroDescription}
              ctaHref={ctaHref}
              subtext={heroSubtext}
              ctaLabel={siteConfig.ctaLabel}
              tagline={siteConfig.tagline}
              backgroundImage={siteConfig.heroBackgroundImage}
            />

            <section id="propiedades" className="pb-16 relative overflow-hidden" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0.14) 12%, transparent 35%), radial-gradient(circle at 90% 80%, rgba(45, 12, 234, 0.1) 0%, rgba(12, 153, 234, 0.1) 18%, transparent 45%), linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(249, 249, 251, 0.6))" }} >
              <CategoryFilter
                search={search}
                onSearchChange={handleSearchChange}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              {filteredProducts.length === 0 ? (
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">{emptyState}</div>
              ) : (
                <PropertiesListing
                  properties={featuredProperties}
                  companyName={siteConfig.companyName}
                  whatsappNumber={siteConfig.whatsappNumber}
                  variant="carousel"
                  viewAllHref="/propiedades"
                  viewAllLabel="Ver todas las propiedades"
                />
              )}
            </section>

            <QueIncluye />

            <AboutUs />
          </>
        )}
      </main>

      <Footer
        companyName={siteConfig.companyName}
        socialLinks={siteConfig.socialLinks}
        address={siteConfig.address}
        mapEmbedUrl={siteConfig.mapEmbedUrl}
        whatsappNumber={siteConfig.whatsappNumber}
        phoneNumber={siteConfig.phoneNumber}
        hours={siteConfig.hours}
      />


    </>
  )
}

function App() {
  return (
    <div
      style={{
        '--brand-color': siteConfig.colors.brand,
        '--brand-dark-color': siteConfig.colors.brandDark,
        '--accent-color': siteConfig.colors.accent,
        '--bg-soft-color': siteConfig.colors.bgSoft,
        '--text-color': siteConfig.colors.text,
      }}
      className="min-h-screen bg-[var(--bg-soft-color)] text-[var(--text-color)] antialiased"
    >
      <Routes>

        {/* PUBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/propiedades" element={<LandingPage />} />
        <Route path="/propiedad/:id" element={<PropertyDetails />} />

        {/* LOGIN */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* PRIVADAS */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/propiedades" element={<AdminPropiedadesPage />} />
          <Route path="/admin/propiedades/nueva" element={<AdminPropiedadFormPage />} />
          <Route path="/admin/propiedades/:id" element={<AdminPropiedadFormPage />} />
          <Route path="/admin/cuenta" element={<AccountPage />} />
          <Route path="/admin/cambiar-password" element={<AccountPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </div>
  )
}

export default App
