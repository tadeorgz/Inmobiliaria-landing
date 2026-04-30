import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Home as HomeIcon, MapPin, CheckCircle2 } from 'lucide-react'
import { courses } from '../data/products'
import { siteConfig } from '../config/siteConfig'
import { createWhatsAppLink } from '../utils/whatsapp'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

export default function PropertyDetails() {
    const { id } = useParams()
    const [selectedImage, setSelectedImage] = useState('')

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    const property = courses.find((p) => p.id === id)

    useEffect(() => {
        if (property) {
            setSelectedImage(property.imagen)
        }
    }, [property])

    if (!property) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <HomeIcon size={48} className="mb-4 text-slate-300" />
                <h1 className="mb-2 text-2xl font-bold text-slate-800">Propiedad no encontrada</h1>
                <p className="mb-6 text-slate-500">La propiedad que buscas no existe o ya no está disponible.</p>
                <button
                    onClick={() => window.history.back()}
                    className="rounded-lg bg-[var(--brand-color)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--brand-dark-color)]"
                >
                    Volver al inicio
                </button>
            </div>
        )
    }

    const formattedPrice = new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: property.moneda === '$' ? 'UYU' : 'USD',
        maximumFractionDigits: 0,
    }).format(property.precio).replace(/UYU|US\$/, property.moneda)

    const isAlquiler = property.operacion.toLowerCase() === 'alquiler'
    const badgeColor = isAlquiler ? 'bg-emerald-500' : 'bg-blue-600'
    const operationText = property.operacion.charAt(0).toUpperCase() + property.operacion.slice(1)

    const whatsappMessage = `Me interesa: ${property.nombre} . Quiero agendar una visita o recibir más información.`
    const whatsappHref = createWhatsAppLink(siteConfig.whatsappNumber, whatsappMessage)

    const images = [property.imagen, ...(property.imagenesExtras || [])]

    // Encontrar propiedades similares (misma operacion, distinto ID, max 3)
    const similarProperties = courses
        .filter((p) => p.operacion === property.operacion && p.id !== property.id)
        .slice(0, 3)

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* App Bar Simple */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
                    <Link

                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[var(--brand-color)]"
                        to="/#propiedades"
                    >
                        <ArrowLeft size={18} />
                        Volver al catálogo
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
                {/* Main Content Info */}
                <div className="mb-6 grid gap-6 md:grid-cols-2 md:gap-10">

                    {/* Left Col: Galería de imágenes */}
                    <div className="space-y-3">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
                            <img
                                src={selectedImage}
                                alt={property.nombre}
                                className="h-full w-full object-cover"
                            />
                            <span className={`absolute left-3 top-3 inline-flex items-center rounded-full ${badgeColor} px-3 py-1 text-xs font-semibold text-white shadow-md`}>
                                {operationText}
                            </span>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex w-auto gap-2 overflow-x-auto pb-2 hide-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === img
                                            ? 'border-[var(--brand-color)]'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`Vista ${idx + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Col: Info */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                            <MapPin size={16} className="text-[var(--brand-color)]" />
                            {property.zona}
                        </div>

                        <h1 className="mb-4 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                            {property.nombre}
                        </h1>

                        <div className="mb-6 inline-block rounded-xl bg-[var(--brand-color)]/10 px-5 py-3 border border-[var(--brand-color)]/20">
                            <p className="text-3xl font-black text-[var(--brand-color)] tracking-tight">
                                {formattedPrice}
                                <span className="ml-1 text-sm font-medium text-[var(--brand-color)]/60">
                                    {isAlquiler ? '/ mes' : ''}
                                </span>
                            </p>
                        </div>

                        {/* Grid de Specs */}
                        <div className="mb-6 grid grid-cols-3 gap-3">
                            {property.dormitorios != null && (
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                                    <Bed size={20} className="mb-1 text-[var(--brand-color)]" />
                                    <span className="text-sm font-bold text-slate-700">{property.dormitorios}</span>
                                    <span className="text-[10px] uppercase text-slate-400">Dorm.</span>
                                </div>
                            )}
                            {property.banios != null && (
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                                    <Bath size={20} className="mb-1 text-[var(--brand-color)]" />
                                    <span className="text-sm font-bold text-slate-700">{property.banios}</span>
                                    <span className="text-[10px] uppercase text-slate-400">Baños</span>
                                </div>
                            )}
                            {property.area != null && (
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                                    <HomeIcon size={20} className="mb-1 text-[var(--brand-color)]" />
                                    <span className="text-sm font-bold text-slate-700">{property.area}</span>
                                    <span className="text-[10px] uppercase text-slate-400">M²</span>
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="mb-2 text-lg font-bold">Descripción</h3>
                            <p className="text-base leading-relaxed text-slate-600">
                                {property.descripcion}
                            </p>

                            {property.servicios && property.servicios.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="mb-2 text-sm font-bold text-slate-700">Comodidades y Servicios</h4>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {property.servicios.map((servicio, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                                {servicio}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* CTA Mobile bottom sticky and desktop normal */}
                        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 sm:static sm:bg-transparent sm:border-0 sm:p-0">
                            <WhatsAppButton
                                href={whatsappHref}
                                label="Agendar visita"
                                className="w-full flex-1 text-xs sm:text-sm"

                            />
                        </div>
                        {/* Spacer for mobile CTA */}
                        <div className="h-20 sm:hidden"></div>
                    </div>
                </div>

                {/* Propiedades Similares */}
                {similarProperties.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-slate-200">
                        <h2 className="mb-6 text-xl font-bold text-slate-800">Propiedades Similares</h2>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {similarProperties.map((sim, idx) => (
                                <Link key={idx} to={`/propiedad/${sim.id}`} className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                                        <img src={sim.imagen} alt={sim.nombre} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-1 text-sm font-bold text-slate-800 line-clamp-1">{sim.nombre}</h3>
                                        <p className="text-base font-black text-[var(--brand-color)]">
                                            {new Intl.NumberFormat('es-UY', { style: 'currency', currency: sim.moneda === '$' ? 'UYU' : 'USD', maximumFractionDigits: 0 }).format(sim.precio)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
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
        </div>
    )
}
