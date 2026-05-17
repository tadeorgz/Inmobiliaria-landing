import { supabase } from '../utils/supabase'

export async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export async function requestPasswordReset(email) {
    const redirectTo = `${window.location.origin}/cambiar-password`
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    return { data, error }
}

export async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    return { data, error }
}

export async function getCurrentSession() {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
}

export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
}
