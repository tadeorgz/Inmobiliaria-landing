import { Award, Home, Heart, MessageCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import WhatsAppButton from './WhatsAppButton'
import { siteConfig } from '../config/siteConfig'
import { createWhatsAppLink } from '../utils/whatsapp'

const stats = [
  { value: '+500', label: 'familias ayudadas', icon: Users },
  { value: '+15', label: 'años de experiencia', icon: Home },
  { value: '98%', label: 'clientes satisfechos', icon: Heart },
  { value: '<2h', label: 'respuesta por WhatsApp', icon: MessageCircle },
]

const carouselImages = [
  { src: '/2ambientes.webp', alt: 'Departamento 2 ambientes' },
  { src: '/3ambientes.webp', alt: 'Propiedad 3 ambientes' },
  { src: '/3ambientesv3.jpeg', alt: 'Casa 3 ambientes' },
  { src: '/4ambientes.jpg', alt: 'Casa 4 ambientes' },
  { src: '/1ambiente.webp', alt: 'Propiedad 1 ambiente' },
  { src: '/5ambientes.jpg', alt: 'Propiedad 5 ambientes' },
]

function AboutUs() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const ctaHref = createWhatsAppLink(
    siteConfig.whatsappNumber,
    `Hola ${siteConfig.companyName}, ¿qué propiedades disponibles tienen actualmente?`,
  )

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <section id="nosotros" className="relative overflow-hidden bg-slate-900 px-4 py-20 text-slate-100 sm:px-6 sm:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-700/30 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand-color)]/20 bg-[var(--brand-color)]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-color)]">
            <Award size={12} />
            Sobre nosotros
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-100 sm:text-5xl">
            Somos {siteConfig.companyName},{' '}
            <span className="text-[var(--brand-color)]">expertos en inmobiliaria</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">
            Con 15+ años acompañando familias a encontrar su hogar ideal. Especializados en compraventa y alquileres en Montevideo, conocemos cada barrio, cada zona, cada oportunidad de inversión.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-color)]/15 ring-1 ring-[var(--brand-color)]/20">
                  <Heart size={18} className="text-[var(--brand-color)]" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-bold text-slate-100">Asesoramiento personalizado</h3>
                  <p className="text-sm leading-relaxed text-slate-300">Escuchamos tus necesidades, presupuesto y objetivos. Buscamos propiedades que realmente se ajusten a tu vida.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-color)]/15 ring-1 ring-[var(--brand-color)]/20">
                  <Users size={18} className="text-[var(--brand-color)]" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-bold text-slate-100">Red de contactos verificados</h3>
                  <p className="text-sm leading-relaxed text-slate-300">Años de relación con propietarios, inquilinos, escribanos y bancos. Propiedades directas, sin intermediarios extra.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-color)]/15 ring-1 ring-[var(--brand-color)]/20">
                  <Home size={18} className="text-[var(--brand-color)]" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-bold text-slate-100">Gestión integral sin sorpresas</h3>
                  <p className="text-sm leading-relaxed text-slate-300">Documentación limpia, tasaciones reales, asesoría legal y análisis de hipotecas. Todo transparente y sin costos ocultos.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--brand-color)]/15 bg-[var(--brand-color)]/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[var(--brand-color)]/30 hover:bg-[var(--brand-color)]/10"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-color)]/15">
                      <Icon size={18} className="text-[var(--brand-color)]" />
                    </div>
                    <p className="text-3xl font-black text-slate-100">{item.value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-300">{item.label}</p>
                    <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[var(--brand-color)]/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                )
              })}
            </div>
            <div className="pt-4">
              <WhatsAppButton href={ctaHref} label="Consultar propiedades" size="lg" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border-2 border-[var(--brand-color)]/20 shadow-xl">
                <div className="aspect-video bg-slate-800">
                  <img
                    src={carouselImages[currentImageIndex].src}
                    alt={carouselImages[currentImageIndex].alt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={prevImage}
                className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-color)] p-2.5 text-white shadow-lg transition-all hover:bg-[var(--brand-dark-color)] hover:scale-110 active:scale-95"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-color)] p-2.5 text-white shadow-lg transition-all hover:bg-[var(--brand-dark-color)] hover:scale-110 active:scale-95"
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={20} />
              </button>

              <div className="mt-4 flex justify-center gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${index === currentImageIndex
                      ? 'w-8 bg-[var(--brand-color)]'
                      : 'w-2.5 bg-[var(--brand-color)]/30 hover:bg-[var(--brand-color)]/50'
                      }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>


            <div className="rounded-2xl border-2 border-[var(--brand-color)]/20 bg-[var(--brand-color)]/8 p-6 backdrop-blur-sm">
              <div className="mb-3 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-200 italic">
                &quot;Excelente atención. Nos mostraron opciones reales, sin vueltas, y nos acompañaron en todo el proceso.&quot;
              </p>
              <p className="mt-3 text-xs font-semibold text-[var(--brand-color)]">— Cliente verificado, Montevideo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
