# Academia Valkiria - Landing

Proyecto React + Vite preparado para deploy en Vercel con configuracion segura base.

## Ejecutar localmente

1. Instalar dependencias:

```bash
npm install
```

2. Crear variables locales desde el ejemplo:

```bash
# PowerShell (Windows)
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

3. Iniciar desarrollo:

```bash
npm run dev
```

## Deploy seguro en Vercel

1. Subir el repositorio a GitHub.
2. En Vercel, importar el proyecto desde GitHub.
3. Verificar configuracion de build:
- Build Command: `npm run build`
- Output Directory: `dist`
4. Cargar variables de entorno en Vercel (Project Settings -> Environment Variables):
- `VITE_PUBLIC_WHATSAPP_NUMBER`
- `VITE_PUBLIC_DEFAULT_WHATSAPP_MESSAGE`
- `VITE_PUBLIC_MAP_EMBED_URL`
- `CONTACT_WEBHOOK_URL` (opcional, solo backend/serverless)
- `ALLOWED_ORIGIN` (opcional, recomendado en produccion)
5. Deploy.

## Seguridad implementada

- Variables sensibles protegidas con `.gitignore`.
- Plantilla segura de variables en `.env.example`.
- Headers de seguridad en `vercel.json`:
	- `X-Frame-Options`
	- `X-Content-Type-Options`
	- `Referrer-Policy`
	- `Permissions-Policy`
	- `Strict-Transport-Security`
	- `Content-Security-Policy`
- Endpoint serverless base para contacto en `api/contact.js`.

## Importante sobre secretos

- Todo valor `VITE_` es publico en el navegador.
- Secretos reales nunca deben ir con prefijo `VITE_`.
- Guardar secretos solo como variables de entorno del backend/serverless.
