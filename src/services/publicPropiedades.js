import { supabase } from '../utils/supabase'

const CLIENTE_ID = import.meta.env.VITE_PUBLIC_CLIENTE_ID || '553b26de-78f1-4fb6-8c09-ca48e76e9aaa'

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
    }
}

export async function getPropiedadesPublicas(clienteId = CLIENTE_ID) {
    const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('cliente_id', clienteId)
        .eq('activa', true)
        .order('destacada', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching propiedades publicas:', error)
        return []
    }

    return data.map(mapPropiedad)
}

export async function getPropiedadPublica(id, clienteId = CLIENTE_ID) {
    const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .eq('cliente_id', clienteId)
        .eq('activa', true)
        .single()

    if (error || !data) {
        if (error) {
            console.error('Error fetching propiedad publica:', error)
        }
        return null
    }

    return mapPropiedad(data)
}

export async function getPropiedadesSimilaresPublicas(operacion, excludeId, limit = 3, clienteId = CLIENTE_ID) {
    const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('cliente_id', clienteId)
        .eq('activa', true)
        .ilike('tipo_operacion', operacion)
        .neq('id', excludeId)
        .order('destacada', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching propiedades publicas similares:', error)
        return []
    }

    return data.map(mapPropiedad)
}
