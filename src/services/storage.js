import { supabase } from '../utils/supabase'

const BUCKET_NAME = 'propiedades'

function sanitizeFilename(filename) {
    return filename
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

function generateUniqueFilename(originalName) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const sanitized = sanitizeFilename(originalName)
    return `${timestamp}-${random}-${sanitized}`
}

export async function uploadImage(file, clienteId, propiedadId) {
    if (!file || !clienteId || !propiedadId) {
        throw new Error('File, clienteId, and propiedadId are required')
    }

    const filename = generateUniqueFilename(file.name)
    const path = `${clienteId}/${propiedadId}/${filename}`

    try {
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (uploadError) {
            throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path)

        return {
            path,
            publicUrl: publicUrlData.publicUrl,
            filename,
        }
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`)
    }
}

export async function uploadMultipleImages(files, clienteId, propiedadId) {
    if (!files || files.length === 0) {
        return []
    }

    try {
        const uploadPromises = Array.from(files).map((file) =>
            uploadImage(file, clienteId, propiedadId)
        )
        return await Promise.all(uploadPromises)
    } catch (error) {
        throw new Error(`Multiple upload failed: ${error.message}`)
    }
}

export async function deleteImage(imagePath) {
    if (!imagePath) {
        throw new Error('Image path is required')
    }

    try {
        const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([imagePath])

        if (deleteError) {
            throw deleteError
        }

        return true
    } catch (error) {
        throw new Error(`Delete failed: ${error.message}`)
    }
}

export async function deleteMultipleImages(imagePaths) {
    if (!imagePaths || imagePaths.length === 0) {
        return true
    }

    try {
        const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(imagePaths)

        if (deleteError) {
            throw deleteError
        }

        return true
    } catch (error) {
        throw new Error(`Multiple delete failed: ${error.message}`)
    }
}

export function extractPathFromUrl(publicUrl) {
    const match = publicUrl.match(new RegExp(`${BUCKET_NAME}/(.+)$`))
    return match ? match[1] : null
}
