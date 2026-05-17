import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { X, Upload } from 'lucide-react'
import { createPropiedad, getPropiedadAdmin, updatePropiedad } from '../services/adminPropiedades'
import { uploadImage, uploadMultipleImages, deleteImage, extractPathFromUrl } from '../services/storage'
import { getClienteIdFromSession } from '../services/adminPropiedades'

const initialForm = {
    titulo: '',
    descripcion: '',
    precio: '',
    moneda: 'USD',
    tipo_operacion: 'venta',
    tipo_propiedad: 'departamento',
    ubicacion: '',
    habitaciones: '',
    banos: '',
    metros_cuadrados: '',
    imagen_url: '',
    imagenes_extra: [],
    servicios: [],
    destacada: false,
    activa: true,
}

export default function AdminPropiedadFormPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = useMemo(() => Boolean(id), [id])

    const [form, setForm] = useState(initialForm)
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [clienteId, setClienteId] = useState(null)
    const [uploadingImages, setUploadingImages] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [imagenMainPreview, setImagenMainPreview] = useState('')
    const [newExtraPreviewUrls, setNewExtraPreviewUrls] = useState([])
    const [mainImageFile, setMainImageFile] = useState(null)
    const [extraImageFiles, setExtraImageFiles] = useState([])

    useEffect(() => {
        const getClienteId = async () => {
            try {
                const cId = await getClienteIdFromSession()
                setClienteId(cId)
            } catch (err) {
                console.error(err)
                setError('No se pudo obtener el cliente ID.')
            }
        }
        getClienteId()
    }, [])

    useEffect(() => {
        if (!isEdit) return

        const loadDetail = async () => {
            try {
                const data = await getPropiedadAdmin(id)
                if (!data) {
                    setError('No se encontro la propiedad para editar.')
                    setLoading(false)
                    return
                }

                setForm({
                    titulo: data.nombre || '',
                    descripcion: data.descripcion || '',
                    precio: data.precio || 0,
                    moneda: data.moneda || 'USD',
                    tipo_operacion: data.operacion || 'venta',
                    tipo_propiedad: data.tipo || 'departamento',
                    ubicacion: data.zona || '',
                    habitaciones: data.dormitorios || '',
                    banos: data.banios || '',
                    metros_cuadrados: data.area || '',
                    imagen_url: data.imagen || '',
                    imagenes_extra: data.imagenesExtras || [],
                    servicios: data.servicios || [],
                    destacada: Boolean(data.destacada),
                    activa: data.activa ?? true,
                })
                setImagenMainPreview(data.imagen || '')
            } catch (err) {
                console.error(err)
                setError('No se pudo cargar la propiedad.')
            } finally {
                setLoading(false)
            }
        }

        loadDetail()
    }, [id, isEdit])

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleImagenMainChange = (event) => {
        const file = event.target.files?.[0]
        console.log('main input files:', event.target.files)
        if (!file) return

        setMainImageFile(file)
        console.log('mainImageFile:', file)

        const previewUrl = URL.createObjectURL(file)
        setImagenMainPreview(previewUrl)
    }

    const handleImagenesExtrasChange = (event) => {
        console.log('extras input files:', event.target.files)
        const filesList = event.target.files
        if (!filesList || filesList.length === 0) return

        const filesArray = Array.from(filesList)
        setExtraImageFiles((prev) => [...prev, ...filesArray])
        console.log('extraImageFiles:', filesArray)

        const previewUrls = filesArray.map((file) => URL.createObjectURL(file))
        setNewExtraPreviewUrls((prev) => [...prev, ...previewUrls])
    }

    const removeMainImage = () => {
        setMainImageFile(null)
        setImagenMainPreview('')
        setForm((prev) => ({ ...prev, imagen_url: '' }))
    }

    const removeExtraImage = async (index) => {
        const existingCount = form.imagenes_extra.length
        const isExistingImage = index < existingCount

        if (!isExistingImage) {
            const newFileIndex = index - existingCount
            setExtraImageFiles((prev) => prev.filter((_, i) => i !== newFileIndex))
            setNewExtraPreviewUrls((prev) => prev.filter((_, i) => i !== newFileIndex))
            return
        }

        const currentUrl = form.imagenes_extra[index]
        try {
            if (currentUrl) {
                const path = extractPathFromUrl(currentUrl)
                if (path) {
                    await deleteImage(path)
                }
            }

            setForm((prev) => ({
                ...prev,
                imagenes_extra: prev.imagenes_extra.filter((_, i) => i !== index),
            }))
        } catch (err) {
            setError(`Error deleting image: ${err.message}`)
        }
    }

    const parseRequiredNumber = (value, fieldName) => {
        const parsed = Number(value)
        if (Number.isNaN(parsed)) {
            throw new Error(`El campo ${fieldName} no es un numero valido.`)
        }
        return parsed
    }

    const uploadSelectedImages = async (propiedadIdForPath) => {
        let finalMainUrl = form.imagen_url || ''
        let finalExtraUrls = [...(form.imagenes_extra || [])]

        console.log('mainImageFile:', mainImageFile)
        console.log('extraImageFiles:', extraImageFiles)

        const totalUploads = (mainImageFile ? 1 : 0) + extraImageFiles.length

        if (totalUploads === 0) {
            return { finalMainUrl, finalExtraUrls }
        }

        setUploadingImages(true)
        setUploadProgress(0)

        try {
            let completed = 0

            if (mainImageFile) {
                const mainResult = await uploadImage(mainImageFile, clienteId, propiedadIdForPath)
                finalMainUrl = mainResult.publicUrl
                completed += 1
                setUploadProgress(Math.round((completed / totalUploads) * 100))
            }

            if (extraImageFiles.length > 0) {
                const extrasResult = await uploadMultipleImages(extraImageFiles, clienteId, propiedadIdForPath)
                finalExtraUrls = [...finalExtraUrls, ...extrasResult.map((item) => item.publicUrl)]
                completed += extraImageFiles.length
                setUploadProgress(Math.round((completed / totalUploads) * 100))
            }

            return { finalMainUrl, finalExtraUrls }
        } finally {
            setUploadingImages(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaving(true)
        setError('')

        try {
            if (!clienteId) {
                throw new Error('No se pudo resolver cliente_id para subir imagenes.')
            }

            const propiedadIdForPath = isEdit ? id : crypto.randomUUID()
            const { finalMainUrl, finalExtraUrls } = await uploadSelectedImages(propiedadIdForPath)

            // En creacion: requerir imagen principal (nueva o ya seteada)
            if (!isEdit && !finalMainUrl) {
                setError('Debes subir una imagen principal para crear la propiedad.')
                setSaving(false)
                return
            }

            const payload = {
                ...form,
                imagen_url: finalMainUrl,
                imagenes_extra: finalExtraUrls,
                precio: parseRequiredNumber(form.precio, 'precio'),
                habitaciones: parseRequiredNumber(form.habitaciones, 'habitaciones'),
                banos: parseRequiredNumber(form.banos, 'banos'),
                metros_cuadrados: parseRequiredNumber(form.metros_cuadrados, 'metros_cuadrados'),
            }

            if (isEdit) {
                await updatePropiedad(id, payload)
            } else {
                await createPropiedad(payload)
            }

            navigate('/admin/propiedades')
        } catch (err) {
            setError(err?.message || 'No se pudo guardar la propiedad.')
        } finally {
            setSaving(false)
            setUploadProgress(0)
        }
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-black text-slate-900">{isEdit ? 'Editar propiedad' : 'Nueva propiedad'}</h1>
                    <Link
                        to="/admin/propiedades"
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Volver
                    </Link>
                </div>

                {loading ? <p className="text-sm text-slate-600">Cargando...</p> : null}
                {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">{error}</p> : null}

                {!loading ? (
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <input
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            value={form.titulo}
                            onChange={(e) => handleChange('titulo', e.target.value)}
                            placeholder="Titulo"
                            required
                        />
                        <textarea
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            value={form.descripcion}
                            onChange={(e) => handleChange('descripcion', e.target.value)}
                            placeholder="Descripcion"
                            rows={4}
                            required
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input
                                type="number"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.precio}
                                onChange={(e) => handleChange('precio', e.target.value)}
                                placeholder="Precio"
                                required
                            />
                            <select
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.moneda}
                                onChange={(e) => handleChange('moneda', e.target.value)}
                            >
                                <option value="USD">USD</option>
                                <option value="$">$</option>
                            </select>
                            <select
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.tipo_operacion}
                                onChange={(e) => handleChange('tipo_operacion', e.target.value)}
                            >
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                            </select>
                            <input
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.tipo_propiedad}
                                onChange={(e) => handleChange('tipo_propiedad', e.target.value)}
                                placeholder="Tipo propiedad"
                                required
                            />
                            <input
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.ubicacion}
                                onChange={(e) => handleChange('ubicacion', e.target.value)}
                                placeholder="Ubicacion"
                                required
                            />
                            <input
                                type="number"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.habitaciones}
                                onChange={(e) => handleChange('habitaciones', e.target.value)}
                                placeholder="Habitaciones"
                                required
                            />
                            <input
                                type="number"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.banos}
                                onChange={(e) => handleChange('banos', e.target.value)}
                                placeholder="Banos"
                                required
                            />
                            <input
                                type="number"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={form.metros_cuadrados}
                                onChange={(e) => handleChange('metros_cuadrados', e.target.value)}
                                placeholder="m2"
                                required
                            />
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-slate-300 p-4">
                            <label className="block cursor-pointer">
                                <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 p-6">
                                    <Upload size={20} className="text-slate-500" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-700">Imagen Principal</p>
                                        <p className="text-xs text-slate-500">Click para subir o arrastra una imagen</p>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImagenMainChange}
                                    disabled={uploadingImages}
                                    className="hidden"
                                />
                            </label>
                            {imagenMainPreview && (
                                <div className="mt-3 rounded-lg overflow-hidden bg-slate-100">
                                    <img
                                        src={imagenMainPreview}
                                        alt="Main preview"
                                        className="max-h-48 w-full object-cover"
                                    />
                                    <div className="p-2">
                                        <button
                                            type="button"
                                            onClick={removeMainImage}
                                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                        >
                                            Quitar imagen principal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-slate-300 p-4">
                            <label className="block cursor-pointer">
                                <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 p-6">
                                    <Upload size={20} className="text-slate-500" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-700">Imágenes Extras</p>
                                        <p className="text-xs text-slate-500">Selecciona múltiples imágenes</p>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagenesExtrasChange}
                                    disabled={uploadingImages}
                                    className="hidden"
                                />
                            </label>
                            {[...(form.imagenes_extra || []), ...newExtraPreviewUrls].length > 0 && (
                                <div className="mt-3 grid gap-3 grid-cols-3 sm:grid-cols-4">
                                    {[...(form.imagenes_extra || []), ...newExtraPreviewUrls].map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={img}
                                                alt={`Extra ${idx + 1}`}
                                                className="h-24 w-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExtraImage(idx)}
                                                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {uploadingImages && (
                            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                                Subiendo imágenes... {uploadProgress}%
                            </div>
                        )}

                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={form.destacada}
                                onChange={(e) => handleChange('destacada', e.target.checked)}
                            />
                            Destacada
                        </label>

                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={form.activa}
                                onChange={(e) => handleChange('activa', e.target.checked)}
                            />
                            Activa
                        </label>

                        <button
                            type="submit"
                            disabled={saving || uploadingImages}
                            className="rounded-lg bg-[var(--brand-color)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark-color)] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </form>
                ) : null}
            </div>
        </div>
    )
}
