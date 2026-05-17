-- =====================================================
-- Supabase Auth + RLS seguro para inmobiliaria
-- =====================================================

-- 1) Tabla puente entre auth.users y clientes
create table if not exists public.usuarios_cliente (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_usuarios_cliente_cliente_id on public.usuarios_cliente(cliente_id);

-- 2) Helper para resolver cliente del usuario autenticado
create or replace function public.current_cliente_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select uc.cliente_id
  from public.usuarios_cliente uc
  where uc.auth_user_id = auth.uid()
  limit 1;
$$;

revoke all on function public.current_cliente_id() from public;
grant execute on function public.current_cliente_id() to authenticated;

-- 3) Permisos basicos de tablas
grant select on public.usuarios_cliente to authenticated;
grant select, insert, update on public.propiedades to authenticated;

-- 4) RLS
alter table public.usuarios_cliente enable row level security;
alter table public.propiedades enable row level security;

-- Limpiar policies previas si existen

drop policy if exists usuarios_cliente_select_own on public.usuarios_cliente;
drop policy if exists propiedades_select_public on public.propiedades;
drop policy if exists propiedades_select_own on public.propiedades;
drop policy if exists propiedades_insert_own on public.propiedades;
drop policy if exists propiedades_update_own on public.propiedades;

-- Usuario solo puede ver su propio mapeo
create policy usuarios_cliente_select_own
on public.usuarios_cliente
for select
to authenticated
using (auth.uid() = auth_user_id);

-- Lectura publica readonly para storefront (solo activas)
create policy propiedades_select_public
on public.propiedades
for select
to public
using (activa = true);

-- Usuario autenticado puede leer todas las de su cliente (activas o no)
create policy propiedades_select_own
on public.propiedades
for select
to authenticated
using (cliente_id = public.current_cliente_id());

-- Usuario solo puede crear propiedades para su cliente
create policy propiedades_insert_own
on public.propiedades
for insert
to authenticated
with check (cliente_id = public.current_cliente_id());

-- Usuario solo puede editar/desactivar sus propiedades
create policy propiedades_update_own
on public.propiedades
for update
to authenticated
using (cliente_id = public.current_cliente_id())
with check (cliente_id = public.current_cliente_id());

-- Importante:
-- No crear policy DELETE para authenticated.
-- El flujo recomendado es desactivar con activa = false.
