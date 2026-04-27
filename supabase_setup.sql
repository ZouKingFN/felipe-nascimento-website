-- SCRIPT DE CONFIGURAÇÃO SUPABASE (RECOMENDAÇÕES ADVISOR)
-- Rode este script no SQL Editor do seu dashboard Supabase

-- 1. Criar a tabela de perfis (se ainda não existir)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  courses text[] default '{}',
  updated_at timestamptz default now()
);

-- 2. Ativar Row Level Security (Segurança)
alter table public.profiles enable row level security;

-- 3. Criar Políticas de Acesso (RLS)
-- 🔒 SEGURANÇA [VULN-2]: Restringe a leitura para que o usuário só consiga ver seu próprio perfil. Evita dump do banco de dados (CWE-200).
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

-- Política: Usuários podem inserir seu próprio perfil
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- Política: Usuários podem atualizar apenas o próprio perfil
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- 4. Índices para Performance (Performance Advisor)
-- Índice no e-mail para buscas rápidas
create index if not exists profiles_email_idx on public.profiles (email);

-- Índice GIN na coluna de cursos para buscas rápidas em listas
create index if not exists profiles_courses_idx on public.profiles using gin (courses);

-- 5. Trigger para atualização automática do 'updated_at'
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure handle_updated_at();

-- COMENTÁRIO:
-- Para adicionar um curso a um usuário via SQL:
-- update public.profiles set courses = array_append(courses, 'ID_DO_CURSO') where id = 'UUID_DO_USUARIO';

-- ==========================================
-- 🔒 CORREÇÃO SEGURANÇA [VULN-1]
-- 6. Tabela Segura de Links VIP (Course Links)
-- ==========================================
create table if not exists public.course_links (
  id uuid default gen_random_uuid() primary key,
  course_id text not null unique,
  sale_token text not null,
  access_link text not null
);

alter table public.course_links enable row level security;

-- Política RLS: Usuário só pode ver o link se possuir o curso
drop policy if exists "Users can view links of owned courses" on public.course_links;
create policy "Users can view links of owned courses"
  on public.course_links for select
  using (
    course_id = any (
      array(select unnest(courses) from public.profiles where id = auth.uid())
    )
  );

-- Inserir os links da Hotmart de forma segura (O backend os guarda, não o client)
insert into public.course_links (course_id, sale_token, access_link)
values ('3155650', 'pay.hotmart.com/B85068976H', 'https://app-vlc.hotmart.com/products/3155650')
on conflict (course_id) do update set 
  sale_token = excluded.sale_token, 
  access_link = excluded.access_link;
