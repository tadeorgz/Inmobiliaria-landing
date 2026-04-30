import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Building2, LayoutGrid } from 'lucide-react'
import ProductCard from './ProductCard'
import { createPropertyInquiryMessage, createWhatsAppLink } from '../utils/whatsapp'

function PropertiesListing({
    properties,
    companyName,
    whatsappNumber,
    variant = 'carousel',
    viewAllHref = '/propiedades',
    viewAllLabel = 'Ver todas las propiedades',
}) {
    const carouselRef = useRef(null)
    const isCarousel = variant === 'carousel'

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return

        const amount = carouselRef.current.clientWidth * 0.92
        carouselRef.current.scrollBy({
            left: direction * amount,
            behavior: 'smooth',
        })
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-[var(--brand-color)]/20 bg-[var(--brand-color)]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-color)]">
                        {isCarousel ? <Building2 size={12} /> : <LayoutGrid size={12} />}
                        {isCarousel ? 'Propiedades destacadas' : 'Todas las propiedades'}
                    </p>
                    <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {isCarousel
                            ? 'Elegidas para mostrarte una vista clara y rápida'
                            : 'Explorá el catálogo completo con filtros y búsqueda'}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        {isCarousel
                            ? 'Deslizá para comparar opciones. Desde acá podés ir a la página completa cuando quieras ver todo el catálogo.'
                            : 'Revisá todas las propiedades disponibles en Montevideo y filtrá por zona, tipo y búsqueda.'}
                    </p>
                </div>

                {isCarousel && (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => scrollCarousel(-1)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all md:hover:-translate-y-0.5 md:hover:border-[var(--brand-color)]/30 md:hover:text-[var(--brand-color)]"
                            aria-label="Ver propiedades anteriores"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollCarousel(1)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all md:hover:-translate-y-0.5 md:hover:border-[var(--brand-color)]/30 md:hover:text-[var(--brand-color)]"
                            aria-label="Ver más propiedades"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {isCarousel ? (
                <div
                    ref={carouselRef}
                    className="flex ] gap-5 overflow-x-auto scroll-smooth pb-4 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {properties.map((property) => {
                        const inquiryMessage = createPropertyInquiryMessage(companyName, property.nombre)
                        const whatsappHref = createWhatsAppLink(whatsappNumber, inquiryMessage)

                        return (
                            <div
                                key={property.id}
                                className="min-w-[86%] snap-start sm:min-w-[48%] lg:min-w-[31.5%]"
                            >
                                <ProductCard product={property} whatsappHref={whatsappHref} />
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {properties.map((property) => {
                        const inquiryMessage = createPropertyInquiryMessage(companyName, property.nombre)
                        const whatsappHref = createWhatsAppLink(whatsappNumber, inquiryMessage)

                        return (
                            <ProductCard key={property.id} product={property} whatsappHref={whatsappHref} />
                        )
                    })}
                </div>
            )}

            {isCarousel && (
                <div className="mt-8 flex flex-col items-center gap-3">
                    <a
                        href={viewAllHref}
                        className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-color)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all md:hover:-translate-y-0.5 md:hover:bg-[var(--brand-dark-color)] md:hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-color)]/50 focus-visible:ring-offset-2"
                    >
                        {viewAllLabel}
                    </a>
                    <p className="text-sm text-slate-500">Podés ver más detalles en la página completa de propiedades.</p>
                </div>
            )}
        </section>
    )
}

export default PropertiesListing
