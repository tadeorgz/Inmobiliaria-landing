import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { siteConfig } from '../config/siteConfig'

export default function LoginPage() {
    const { isAuthenticated, signInWithEmail, requestPasswordReset } = useAuth()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resetMessage, setResetMessage] = useState('')

    const from = location.state?.from?.pathname || '/admin'

    if (isAuthenticated) {
        return <Navigate to={from} replace />
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')
        setResetMessage('')

        const { error: signInError } = await signInWithEmail(email, password)

        if (signInError) {
            setError('No se pudo iniciar sesion. Verifica email y password.')
            setLoading(false)
            return
        }

        setLoading(false)
    }

    const handleResetPassword = async () => {
        if (!email.trim()) {
            setError('Ingresa tu email para enviar el reset de password.')
            return
        }

        setLoading(true)
        setError('')
        setResetMessage('')

        const { error: resetError } = await requestPasswordReset(email.trim())

        if (resetError) {
            setError('No se pudo enviar el email de recuperacion.')
            setLoading(false)
            return
        }

        setResetMessage('Te enviamos un enlace para resetear tu password.')
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-soft-color)] px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h1 className="text-2xl font-black text-slate-900">Acceso clientes</h1>
                <p className="mt-1 text-sm text-slate-500">Gestiona tus propiedades con tu cuenta de Supabase Auth.</p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/20"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/20"
                            placeholder="********"
                            required
                        />
                    </div>

                    {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
                    {resetMessage ? <p className="text-sm font-medium text-emerald-600">{resetMessage}</p> : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[var(--brand-color)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark-color)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? 'Ingresando...' : 'Iniciar sesion'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    Olvide mi password
                </button>

                <div className="mt-4 text-center text-sm text-slate-600">
                    <Link to="/" className="font-medium text-[var(--brand-color)] hover:underline">
                        Volver
                    </Link>
                </div>
                <p className="mt-6 text-center text-xs text-slate-400">{siteConfig.companyName}</p>
            </div>
        </div>
    )
}
