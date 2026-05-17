import { supabase } from '../utils/supabase'

function mapPropiedad(prop) {
    return {
        id: prop.id,
        nombre: prop.titulo,
        descripcion: prop.descripcion,
        precio: prop.precio,
        moneda: prop.moneda,
        operacion: (prop.tipo_operacion || '').toLowerCase(),
        tipo: (prop.tipo_propiedad || '').toLowerCase(),
        zona: prop.ubicacion,
        dormitorios: prop.habitaciones,
        banios: prop.banos,
        area: prop.metros_cuadrados,
        imagen: prop.imagen_url,
        imagenesExtras: prop.imagenes_extra || [],
        servicios: prop.servicios || [],
        destacada: Boolean(prop.destacada),
        activa: Boolean(prop.activa),
    }
}

export async function getClienteIdFromSession() {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('Sesion no valida para resolver cliente_id')
    }

    const { data, error } = await supabase
        .from('usuarios_cliente')
        .select('cliente_id')
        .eq('auth_user_id', user.id)
        .single()

    if (error || !data?.cliente_id) {
        throw new Error('No existe relacion entre usuario autenticado y cliente')
    }

    return data.cliente_id
}

export async function getPropiedadesAdmin() {
    const clienteId = await getClienteIdFromSession()

    const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('destacada', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    return data.map(mapPropiedad)
}

export async function getPropiedadAdmin(id) {
    const clienteId = await getClienteIdFromSession()

    const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .eq('cliente_id', clienteId)
        .single()

    if (error || !data) {
        if (error) {
            throw error
        }
        return null
    }

    return mapPropiedad(data)
}

export async function createPropiedad(input) {
    const clienteId = await getClienteIdFromSession()

    // Nunca confiar en cliente_id desde frontend
    const payload = {
        titulo: input.titulo,
        descripcion: input.descripcion,
        precio: Number(input.precio),
        moneda: input.moneda,
        tipo_operacion: input.tipo_operacion,
        tipo_propiedad: input.tipo_propiedad,
        ubicacion: input.ubicacion,
        habitaciones: Number(input.habitaciones),
        banos: Number(input.banos),
        metros_cuadrados: Number(input.metros_cuadrados),
        imagen_url: input.imagen_url,
        imagenes_extra: input.imagenes_extra || [],
        servicios: input.servicios || [],
        destacada: Boolean(input.destacada),
        activa: input.activa ?? true,
        cliente_id: clienteId,
    }

    const { data, error } = await supabase
        .from('propiedades')
        .insert(payload)
        .select('*')

    if (error) {
        throw error
    }

    if (!data || data.length === 0) {
        throw new Error('No se pudo crear la propiedad.')
    }

    return mapPropiedad(data[0])
}

export async function updatePropiedad(id, input) {
    const clienteId = await getClienteIdFromSession()

    const parseNumberOrNull = (value) => {
        const parsed = Number(value)
        return Number.isNaN(parsed) ? null : parsed
    }

    const payload = {
        titulo: input.titulo,
        descripcion: input.descripcion,
        precio: parseNumberOrNull(input.precio),
        moneda: input.moneda,
        tipo_operacion: input.tipo_operacion,
        tipo_propiedad: input.tipo_propiedad,
        ubicacion: input.ubicacion,
        habitaciones: parseNumberOrNull(input.habitaciones),
        banos: parseNumberOrNull(input.banos),
        metros_cuadrados: parseNumberOrNull(input.metros_cuadrados),
        imagen_url: input.imagen_url,
        imagenes_extra: input.imagenes_extra || [],
        servicios: input.servicios || [],
        destacada: Boolean(input.destacada),
        activa: Boolean(input.activa),
    }

    console.log('Updating propiedad', {
        id,
        clienteId,
        payload,
    })

    const { data, error, count } = await supabase
        .from('propiedades')
        .update(payload)
        .eq('id', id)
        .select('id', { count: 'exact' })

    console.log({ data, error, count })

    if (error) {
        throw error
    }

    if (!data || data.length === 0 || count === 0) {
        throw new Error('No se pudo actualizar la propiedad. Verifica RLS, auth.uid(), cliente_id o id de la fila.')
    }

    const updated = await getPropiedadAdmin(id)
    return updated || mapPropiedad(data[0])
}

export async function softDeletePropiedad(id) {
    const clienteId = await getClienteIdFromSession()

    const { error } = await supabase
        .from('propiedades')
        .update({ activa: false })
        .eq('id', id)
        .eq('cliente_id', clienteId)

    if (error) {
        throw error
    }

    return { id }
}
