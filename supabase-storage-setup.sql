-- SUPABASE STORAGE SETUP
-- Execute these SQL commands in Supabase SQL Editor

-- 1. CREATE THE STORAGE BUCKET
-- Note: This can also be done via the Supabase dashboard
-- Storage > Buckets > Create Bucket > "propiedades" > Make it public

-- If using SQL, you'll need to use RLS policies instead. Follow the steps below.

-- 2. ENABLE ROW LEVEL SECURITY ON storage.objects
-- Ensure RLS is enabled for storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. ALLOW PUBLIC READ ACCESS (anyone can view images)
CREATE POLICY "Public Access - Read"
ON storage.objects FOR SELECT USING (
    bucket_id = 'propiedades'
);

-- 4. ALLOW AUTHENTICATED USERS TO UPLOAD (only authenticated users can upload files)
CREATE POLICY "Authenticated Users - Upload"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'propiedades'
    AND auth.role() = 'authenticated'
);

-- 5. ALLOW USERS TO DELETE THEIR OWN FILES
-- This policy assumes files are organized as: cliente_id/propiedad_id/filename
-- Only users with access to that cliente_id can delete
CREATE POLICY "Delete Own Files"
ON storage.objects FOR DELETE USING (
    bucket_id = 'propiedades'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
        SELECT cliente_id::text FROM usuarios_cliente
        WHERE auth_user_id = auth.uid()
    )
);

-- 6. ALLOW UPDATES TO OWN FILES (for metadata)
CREATE POLICY "Update Own Files"
ON storage.objects FOR UPDATE WITH CHECK (
    bucket_id = 'propiedades'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
        SELECT cliente_id::text FROM usuarios_cliente
        WHERE auth_user_id = auth.uid()
    )
);

-- BUCKET CREATION (via Dashboard or API)
-- If you prefer dashboard:
-- 1. Go to Supabase Dashboard > Storage > Buckets
-- 2. Click "Create Bucket"
-- 3. Name: "propiedades"
-- 4. Check "Public bucket"
-- 5. Create

-- OR via API (Supabase Management API - requires auth token):
-- POST https://api.supabase.com/v1/projects/{project-id}/storage/buckets
-- Headers: Authorization: Bearer {access-token}
-- Body: {
--   "name": "propiedades",
--   "public": true
-- }

-- VERIFICATION QUERIES
-- Run these to verify setup:

-- Check if bucket exists:
SELECT name, public FROM storage.buckets WHERE name = 'propiedades';

-- Check RLS policies:
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Test structure: propiedades/cliente_id/propiedad_id/filename
-- Example path: propiedades/553b26de/abc123/portada.webp
