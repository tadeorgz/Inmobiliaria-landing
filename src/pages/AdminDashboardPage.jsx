import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/siteConfig'
import { getPropiedadesAdmin } from '../services/adminPropiedades'


export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [counts, setCounts] = useState({ total: 0, activas: 0, destacadas: 0 })

    const loadCounts = async () => {
        setLoading(true)
        setError('')
        try {
            const items = await getPropiedadesAdmin()
            setCounts({
                total: items.length,
                activas: items.filter(i => i.activa).length,
                destacadas: items.filter(i => i.destacada).length,
            })
        } catch (err) {
            setError('No se pudieron cargar estadísticas.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCounts()
    }, [])

    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Bienvenido al Panel de Administración</h1>
                        <p className="mt-1 text-sm text-slate-600">Gestioná propiedades, imágenes y contenido de tu sitio.</p>
                    </div>
                    <div className="mt-4 flex items-center gap-4 sm:mt-0">
                        {loading ? (
                            <div className="text-sm text-slate-500">Cargando estadísticas…</div>
                        ) : error ? (
                            <div className="text-sm text-red-600">{error}</div>
                        ) : (
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                                    <div className="text-xs text-slate-500">Total</div>
                                    <div className="text-lg font-semibold text-slate-900">{counts.total}</div>
                                </div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                                    <div className="text-xs text-slate-500">Activas</div>
                                    <div className="text-lg font-semibold text-slate-900">{counts.activas}</div>
                                </div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                                    <div className="text-xs text-slate-500">Destacadas</div>
                                    <div className="text-lg font-semibold text-slate-900">{counts.destacadas}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                <Link to="/admin/propiedades" className="group">
                    <div className="flex h-full transform flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div>
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-color)] text-white">🏘</div>
                            <h3 className="text-lg font-semibold text-slate-900">Ver propiedades</h3>
                            <p className="mt-2 text-sm text-slate-600">Administrá y editá las propiedades cargadas</p>
                        </div>
                        <div className="mt-6 text-sm font-medium text-[var(--brand-color)]">Ir a propiedades →</div>
                    </div>
                </Link>

                <Link to="/admin/propiedades/nueva" className="group">
                    <div className="flex h-full transform flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div>
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-color)] text-white">➕</div>
                            <h3 className="text-lg font-semibold text-slate-900">Nueva propiedad</h3>
                            <p className="mt-2 text-sm text-slate-600">Cargá una nueva propiedad al catálogo</p>
                        </div>
                        <div className="mt-6 text-sm font-medium text-[var(--brand-color)]">Crear propiedad →</div>
                    </div>
                </Link>

                <Link to="/admin/cuenta" className="group">
                    <div className="flex h-full transform flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div>
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-color)] text-white">👤</div>
                            <h3 className="text-lg font-semibold text-slate-900">Mi cuenta</h3>
                            <p className="mt-2 text-sm text-slate-600">Configurá acceso y datos del panel</p>
                        </div>
                        <div className="mt-6 text-sm font-medium text-[var(--brand-color)]">Ir a la cuenta →</div>
                    </div>
                </Link>

                <Link to="/" className="group">
                    <div className="flex h-full transform flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div>
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-color)] text-white">🌐</div>
                            <h3 className="text-lg font-semibold text-slate-900">Ver sitio público</h3>
                            <p className="mt-2 text-sm text-slate-600">Ir a la página pública del sitio</p>
                        </div>
                        <div className="mt-6 text-sm font-medium text-[var(--brand-color)]">Ir al sitio →</div>
                    </div>
                </Link>
            </div>
            {/* Footer */}
            <div className="mt-12 rounded-2xl  p-6 text-center ">
                <p className="text-sm text-slate-600">
                    ClientesYa, gracias por usar nuestro panel de administración.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                    Tienes alguna sugerencia o problema? Contáctanos a {' '}
                    <a href="https://wa.me/59894984842" className="text-[var(--brand-color)] hover:underline">
                        +598 94 984 842
                    </a>
                </p>
            </div>
        </div>
    )
}
