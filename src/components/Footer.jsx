import { Globe, MapPin, Phone, Store, Home } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'
import { createWhatsAppLink } from '../utils/whatsapp'
const iconByName = {
  Instagram: Globe,
  Facebook: Globe,
  TikTok: Globe,
}

function Footer({ companyName, socialLinks, address, mapEmbedUrl, whatsappNumber, phoneNumber, hours }) {
  return (
    <footer id="contacto" className="mt-0 border-t border-[var(--brand-color)]/20 bg-white">
      {/* Top CTA band */}
      <div className="bg-gradient-to-r from-[var(--brand-color)] via-[var(--brand-dark-color)] to-[var(--brand-color)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="h-20 w-20 rounded-lg bg-[var(--brand-color)]/20 flex items-center justify-center text-[var(--brand-color)]">
              <Home size={40} />
            </div>
            <div>

              <h2 className="text-2xl font-black text-white sm:text-3xl">Encontrá tu hogar perfecto</h2>
              <p className="mt-1 text-white/80">Escribinos por WhatsApp y te mostramos propiedades disponibles en Montevideo.</p>
            </div>
          </div>
          <WhatsAppButton href={createWhatsAppLink(whatsappNumber, "Quiero ver propiedades disponibles. ¿Cuáles me recomiendan?")} label="Consultar ahora" size="lg" />
        </div>
      </div>

      {/* Main footer content */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brand-color)]">
                <Store size={12} />
                Contacto
              </div>
              <h3 className="text-xl font-black text-slate-900">{companyName}</h3>
              {hours && (
                <>
                  <p className="mt-1 text-sm text-slate-600">{hours.weekdays}</p>
                  <p className="mt-1 text-sm text-slate-600">{hours.saturday}</p>
                </>
              )}
            </div>

            <div className="space-y-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-[var(--brand-color)]"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-color)]/10 group-hover:bg-[var(--brand-color)]/20">
                  <MapPin size={13} className="text-[var(--brand-color)]" />
                </div>
                <span className="leading-none">{address}</span>
              </a>

              <a
                href={`tel:${whatsappNumber}`}
                className="group inline-flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-[var(--brand-color)]"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-color)]/10 group-hover:bg-[var(--brand-color)]/20">
                  <Phone size={13} className="text-[var(--brand-color)]" />
                </div>
                <span className="leading-none">{whatsappNumber}</span>
              </a>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((social) => {
                const SocialIcon = iconByName[social.name] || Globe
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--brand-color)]/20 px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-[var(--brand-color)]/40 hover:bg-[var(--brand-color)]/8 hover:text-[var(--brand-color)]"
                  >
                    <SocialIcon size={14} />
                    {social.name}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-[var(--brand-color)]/15 shadow-md">
            <iframe
              title="Mapa de ubicacion"
              src={mapEmbedUrl}
              className="h-64 w-full border-0 lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto mt-10 w-full max-w-7xl border-t border-[var(--brand-color)]/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer