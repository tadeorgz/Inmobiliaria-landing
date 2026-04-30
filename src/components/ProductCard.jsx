import { MapPin, Tag, Bed, Home, Bath } from 'lucide-react'
import { Link } from 'react-router-dom'
import WhatsAppButton from './WhatsAppButton'

function ProductCard({ product, whatsappHref }) {
  const formattedPrice = new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: product.moneda === '$' ? 'UYU' : 'USD',
    maximumFractionDigits: 0,
  }).format(product.precio).replace(/UYU|US\$/, product.moneda)

  // Badge de operación (Venta/Alquiler) con color dinámico
  const isAlquiler = product.operacion.toLowerCase() === 'alquiler'
  const badgeColor = isAlquiler ? 'bg-emerald-500' : 'bg-blue-600'
  const operationText = product.operacion.charAt(0).toUpperCase() + product.operacion.slice(1)

  return (
    <article className="group min-h-[465px] relative flex flex-col overflow-hidden rounded-2xl border border-[var(--brand-color)]/15 bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--brand-color)]/40 hover:shadow-xl hover:shadow-[var(--brand-color)]/15 focus-within:-translate-y-2 focus-within:border-[var(--brand-color)]/40 focus-within:shadow-xl focus-within:shadow-[var(--brand-color)]/20">
      <Link to={`/propiedad/${product.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">Ver detalles de {product.nombre}</span>
      </Link>

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-200 sm:h-56">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="h-full w-full  object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Type badge (Venta/Alquiler) */}
        <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full ${badgeColor} px-3 py-1 text-xs font-semibold text-white shadow-md`}>
          <Tag size={10} />
          {operationText}
        </span>

        {/* Zone badge */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-md">
          <MapPin size={10} />
          {product.zona}
        </span>

        {/* Quick-action overlay */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="rounded-full bg-[var(--brand-color)] px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm shadow-md">
            Ver detalles
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5 relative z-20 pointer-events-none">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-[var(--brand-color)]">
          {product.nombre}
        </h3>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {product.descripcion}
        </p>

        {/* Property specs grid - responsive */}
        <div className="grid grid-cols-3 gap-2 py-2">
          {product.dormitorios != null && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 rounded-lg bg-slate-50 p-2 border border-slate-100">
              <Bed size={14} className="text-[var(--brand-color)] shrink-0" />
              <span className="font-medium truncate">{product.dormitorios} dorm.</span>
            </div>
          )}
          {product.banios != null && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 rounded-lg bg-slate-50 p-2 border border-slate-100">
              <Bath size={14} className="text-[var(--brand-color)] shrink-0" />
              <span className="font-medium truncate">{product.banios} baños</span>
            </div>
          )}
          {product.area != null && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 rounded-lg bg-slate-50 p-2 border border-slate-100">
              <Home size={14} className="text-[var(--brand-color)] shrink-0" />
              <span className="font-medium truncate">{product.area} m²</span>
            </div>
          )}
        </div>

        {/* Servicios - responsive grid */}
        {product.servicios && product.servicios.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.servicios.slice(0, 3).map((servicio, idx) => (
              <span key={idx} className="inline-flex items-center rounded-full bg-[var(--brand-color)]/8 px-2 py-1 text-[10px] font-medium text-[var(--brand-color)] border border-[var(--brand-color)]/20">
                {servicio}
              </span>
            ))}
            {product.servicios.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                +{product.servicios.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between rounded-xl bg-[var(--brand-color)]/10 px-4 py-2.5 border border-[var(--brand-color)]/20 mt-1">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--brand-color)]/70">
            {isAlquiler ? 'Alquiler mes' : 'Valor'}
          </span>
          <p className="inline-flex items-center gap-1.5 text-base font-extrabold text-[var(--brand-color)]">
            {formattedPrice}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mt-1 pointer-events-auto">
          <WhatsAppButton
            href={whatsappHref}
            label="Consultar propiedad"
            className="w-full flex-1 text-xs sm:text-sm"
          />
        </div>
      </div>
    </article>
  )
}

export default ProductCard
