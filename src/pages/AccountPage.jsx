import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccountPage() {
    const { user, signOut, updatePassword } = useAuth()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handlePasswordUpdate = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')

        if (newPassword.length < 8) {
            setError('La nueva password debe tener al menos 8 caracteres.')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Las passwords no coinciden.')
            return
        }

        setLoading(true)
        const { error: updateError } = await updatePassword(newPassword)

        if (updateError) {
            setError('No se pudo actualizar la password.')
            setLoading(false)
            return
        }

        setMessage('Password actualizada correctamente.')
        setNewPassword('')
        setConfirmPassword('')
        setLoading(false)
    }

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <h1 className="text-2xl font-black text-slate-900">Mi cuenta</h1>
                <p className="mt-1 text-sm text-slate-500">Usuario autenticado: {user?.email}</p>

                <form className="mt-6 space-y-4" onSubmit={handlePasswordUpdate}>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Cambiar password</h2>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="new-password">
                            Nueva password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/20"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="confirm-password">
                            Confirmar nueva password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/20"
                            required
                        />
                    </div>

                    {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
                    {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-[var(--brand-color)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark-color)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? 'Guardando...' : 'Actualizar password'}
                    </button>
                </form>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Cerrar sesion
                    </button>
                    <Link
                        to="/admin"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
                    >
                        Volver al panel
                    </Link>
                </div>
            </div>
        </div>
    )
}
