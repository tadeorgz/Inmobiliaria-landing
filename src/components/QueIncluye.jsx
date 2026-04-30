import { Award, BadgeCheck, CheckCircle2, Home, DollarSign, Handshake } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'
import { siteConfig } from '../config/siteConfig'
import { createWhatsAppLink } from '../utils/whatsapp'

const propertyTypes = [
    { type: 'Departamento', description: 'Desde 60m² a 200m². Urbanos, modernos, con amenities y seguridad 24hs.', zones: 'Centro, Pocitos, Parque Batlle' },
    { type: 'Casa', description: 'Desde 200m² a 600m². Familiares, con patio, cochera y jardín.', zones: 'Buceo, Punta Carretas, Carrasco' },
    { type: 'Penthouse', description: 'Lujo, vistas panorámicas, terrazas amplias y servicios premium.', zones: 'Pocitos, Tres Cruces' },
]

const buyingProcess = [
    {
        icon: Home,
        title: 'Selecciona tu propiedad',
        text: 'Navega por nuestro catálogo, filtra por zona, precio y tipo. Consultá sin compromiso por WhatsApp.',
    },
    {
        icon: CheckCircle2,
        title: 'Verificamos documentación',
        text: 'Revisamos títulos, impuestos y cargas. Todo debe estar en regla. Máxima transparencia.',
    },
    {
        icon: Handshake,
        title: 'Negociamos juntos',
        text: 'Te asesoramos en oferta, financiación y términos. Apoyo legal en cada paso.',
    },
    {
        icon: DollarSign,
        title: 'Cerramos la operación',
        text: 'Escrituración, impuestos, registral. Equipo legal completo. Tu propiedad es tuya.',
    },
]

const whyChooseUs = [
    'Propiedades verificadas y documentación limpia',
    'Asesoramiento personalizado sin costo adicional',
    'Gestión integral de trámites y papeleos',
    'Financiación y análisis de hipotecas',
    'Zona norte, centro, este: conocemos Montevideo',
    'Soporte por WhatsApp 24/7',
]

function QueIncluye() {
    return (
        <section id="proceso" className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-200/60" />
            <div className="absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[var(--brand-color)]/5 blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-blue-600/5 blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_bottom,transparent_5%,black_40%,black_80%,transparent_100%)]" />

            <div className="relative mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand-color)]/40 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-color)] shadow-sm">
                        <Award size={12} />
                        Proceso de compra/alquiler
                    </p>
                    <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
                        Cómo hacemos más fácil tu búsqueda de hogar
                    </h2>
                    <p className="mt-5 mx-auto max-w-3xl text-lg leading-relaxed text-slate-600">
                        Desde la búsqueda hasta la escritura. Un equipo experto te acompaña en cada paso sin complicaciones.
                    </p>
                </div>

                {/* Process Steps */}
                <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {buyingProcess.map((step, idx) => {
                        const Icon = step.icon
                        return (
                            <div key={idx} className="relative">
                                {idx < buyingProcess.length - 1 && (
                                    <div className="absolute right-0 top-12 hidden h-1 w-full translate-x-1/2 bg-gradient-to-r from-[var(--brand-color)] to-transparent lg:block" />
                                )}
                                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--brand-color)]/30">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-color)]/10 ring-1 ring-[var(--brand-color)]/20">
                                        <Icon size={24} className="text-[var(--brand-color)]" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{step.text}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Types & Why Choose Us */}
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Property Types */}
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Home className="text-[var(--brand-color)]" size={24} />
                            <h3 className="text-2xl font-black text-slate-900">Tipos de propiedades</h3>
                        </div>
                        <div className="space-y-4">
                            {propertyTypes.map((prop) => (
                                <div key={prop.type} className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-[var(--brand-color)]/30 hover:bg-[var(--brand-color)]/5 transition-all">
                                    <p className="text-sm font-bold text-slate-900">{prop.type}</p>
                                    <p className="mt-1 text-xs text-slate-600">{prop.description}</p>
                                    <p className="mt-2 text-xs font-semibold text-[var(--brand-color)]">📍 {prop.zones}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <BadgeCheck className="text-[var(--brand-color)]" size={24} />
                            <h3 className="text-2xl font-black text-slate-900">¿Por qué elegirnos?</h3>
                        </div>
                        <ul className="space-y-3">
                            {whyChooseUs.map((reason) => (
                                <li key={reason} className="flex gap-3 text-sm text-slate-600">
                                    <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-color)]" size={16} />
                                    {reason}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <WhatsAppButton
                                href={createWhatsAppLink(siteConfig.whatsappNumber, `Hola ${siteConfig.companyName}, quiero consultar sobre propiedades y el proceso de compra/alquiler.`)}
                                label="Consultar ahora"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QueIncluye