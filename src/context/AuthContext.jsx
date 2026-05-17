import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
    getCurrentSession,
    onAuthStateChange,
    requestPasswordReset,
    signInWithEmail,
    signOut,
    updatePassword,
} from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const initialize = async () => {
            const { data } = await getCurrentSession()
            if (!mounted) return

            const currentSession = data?.session ?? null
            setSession(currentSession)
            setUser(currentSession?.user ?? null)
            setLoading(false)
        }

        initialize()

        const {
            data: { subscription },
        } = onAuthStateChange((_event, nextSession) => {
            setSession(nextSession)
            setUser(nextSession?.user ?? null)
            setLoading(false)
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const value = useMemo(
        () => ({
            session,
            user,
            isAuthenticated: Boolean(user),
            loading,
            signInWithEmail,
            signOut,
            requestPasswordReset,
            updatePassword,
        }),
        [loading, session, user],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }
    return context
}
