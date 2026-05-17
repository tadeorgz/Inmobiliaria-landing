import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPropiedadesAdmin, softDeletePropiedad } from '../services/adminPropiedades'

export default function AdminPropiedadesPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadItems = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getPropiedadesAdmin()
            setItems(data)
        } catch (err) {
            setError('No se pudieron cargar las propiedades del admin.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadItems()
    }, [])

    const handleSoftDelete = async (id) => {
        try {
            await softDeletePropiedad(id)
            await loadItems()
        } catch (_err) {
            setError('No se pudo desactivar la propiedad.')
        }
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-black text-slate-900">Admin · Propiedades</h1>
                    <div className="flex gap-2">
                        <Link
                            to="/admin"
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/propiedades/nueva"
                            className="rounded-lg bg-[var(--brand-color)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark-color)]"
                        >
                            Nueva
                        </Link>
                    </div>
                </div>
                {loading ? (
                    <p className="text-sm text-slate-600">Cargando...</p>
                ) : null}

                {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

                {!loading && items.length === 0 ? (
                    <p className="text-sm text-slate-600">No hay propiedades cargadas.</p>
                ) : null}

                {!loading && items.length > 0 ? (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Total: <span className="font-medium text-slate-900">{items.length}</span>
                                {' '}· Activas: <span className="font-medium text-slate-900">{items.filter(i => i.activa).length}</span>
                                {' '}· Inactivas: <span className="font-medium text-slate-900">{items.filter(i => !i.activa).length}</span>
                            </div>
                        </div>

                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    {item.destacada ? (
                                        <div className="absolute left-4 top-4 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-slate-900">★ Destacada</div>
                                    ) : null}

                                    <div className="mb-3 flex gap-4">
                                        {item.imagen ? (
                                            <img src={item.imagen} alt={item.nombre} className="h-20 w-28 flex-shrink-0 rounded-md object-cover" />
                                        ) : (
                                            <div className="flex h-20 w-28 items-center justify-center rounded-md bg-slate-100 text-sm text-slate-500">No imagen</div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold text-slate-900 truncate">{item.nombre}</h3>
                                            <p className="mt-1 text-xs text-slate-600">{item.operacion} · {item.tipo}</p>
                                            <p className="mt-2 text-sm font-medium text-slate-800">{item.moneda} {item.precio}</p>
                                            <p className="mt-1 text-xs text-slate-500">{item.zona}</p>
                                            <div className="mt-2 flex gap-2 text-xs text-slate-600">
                                                {item.dormitorios ? <span>🛏 {item.dormitorios}</span> : null}
                                                {item.banios ? <span>🛁 {item.banios}</span> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between gap-4">
                                        <div className="text-sm font-medium text-slate-700">{item.activa ? 'Activa' : 'Inactiva'}</div>

                                        <div className="flex flex-shrink-0 gap-2">
                                            <Link
                                                to={`/admin/propiedades/${item.id}`}
                                                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                            >
                                                Editar
                                            </Link>
                                            {item.activa ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('¿Desactivar esta propiedad?')) {
                                                            handleSoftDelete(item.id)
                                                        }
                                                    }}
                                                    className="inline-flex items-center rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                                                >
                                                    Desactivar
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}
