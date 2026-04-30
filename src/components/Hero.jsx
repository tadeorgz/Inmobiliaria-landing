import { Star, ShieldCheck, Home, MessageCircle } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'
import { siteConfig } from '../config/siteConfig'

const benefits = [
  {
    icon: Home,
    title: 'Propiedades verificadas',
    description: 'Catálogo exclusivo con propiedades inspeccionadas. Toda la documentación revisada y garantizada. Sin sorpresas.',
    accent: false,
  },
  {
    icon: ShieldCheck,
    title: 'Asesoramiento experto',
    description: 'Equipo profesional con 15+ años en inmobiliaria. Tramitamos todo: escrituras, impuestos, hipotecas. Te acompañamos.',
    accent: true,
  },
  {
    icon: MessageCircle,
    title: 'Soporte por WhatsApp 24/7',
    description: 'Consultas rápidas, fotos adicionales, videos tours. Disponibles cuando te convenga. Respuesta en minutos.',
    accent: false,
  },
]

function Hero({ title, description, ctaHref, ctaLabel, tagline, backgroundImage, subtext }) {
  const bgImage = backgroundImage
  // Last 4 words get accent color
  const words = title.split(' ')
  const split = Math.max(0, words.length - 4)
  const mainWords = words.slice(0, split).join(' ')
  const accentWords = words.slice(split).join(' ')

  return (
    <section id="inicio" className="relative isolate min-h-screen overflow-hidden">

      <div
        className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat brightness-[0.65] saturate-[1.15]"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(220,38,38,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.03)_100%)]" />

      <div className="relative flex min-h-screen flex-col px-4 pb-6 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-end gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.68fr)] lg:items-center">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 shadow-lg shadow-black/20 backdrop-blur-xl">
              <Star size={11} className="fill-[var(--accent-color)] text-[var(--accent-color)]" />
              {tagline}
            </div>

            <h1 className="text-balance text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.75rem]">
              {mainWords && <span>{mainWords} </span>}
              <span
                className="bg-gradient-to-r from-[var(--accent-color)] to-[var(--brand-color)] bg-clip-text text-transparent"
                style={{ textShadow: '0 0 60px rgba(220,38,38,0.3)' }}
              >
                {accentWords}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-200/90 sm:text-lg">
              {description}
            </p>

            {subtext && (
              <p className="mt-3 text-sm text-slate-200/80">{subtext}</p>
            )}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton href={ctaHref} label={ctaLabel} size="lg" />
              <a
                href="#propiedades"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/12"
              >
                Ver propiedades
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/7 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:justify-self-end">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                Por qué elegir {siteConfig?.companyName || 'nosotros'}
              </p>
              <div className="mt-4 space-y-3">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8"
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${benefit.accent
                        ? 'from-transparent via-[var(--accent-color)] to-transparent'
                        : 'from-transparent via-[var(--brand-color)] to-transparent'
                        }`}
                    />
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${benefit.accent
                          ? 'bg-[var(--accent-color)]/15 ring-[var(--accent-color)]/20'
                          : 'bg-[var(--brand-color)]/15 ring-[var(--brand-color)]/20'
                          }`}
                      >
                        <benefit.icon
                          size={18}
                          className={benefit.accent ? 'text-[var(--accent-color)]' : 'text-[var(--brand-color)]'}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">{benefit.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-300/80">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero