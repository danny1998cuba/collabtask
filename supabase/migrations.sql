-- Tipos personalizados
create type task_status as enum (
  'backlog',
  'todo',
  'in_progress',
  'blocked',
  'in_review',
  'done',
  'cancelled',
  'archived'
);
create type org_role as enum ('org:admin', 'org:member');

-- Tabla de usuarios (opcional para info adicional)
create table users (
  id text primary key, -- Igual a Clerk user_id
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla de organizaciones (igual a organization.id de Clerk)
create table organizations (
  id text primary key,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Miembros de una organización (puedes usarla para permisos extra)
create table organization_members (
  organization_id text references organizations(id) on delete cascade,
  user_id text references users(id) on delete cascade,
  role org_role default 'org:member',
  joined_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (organization_id, user_id)
);

-- Tableros (tanto personales como de organización)
create table boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_personal boolean default false,
  organization_id text references organizations(id),
  created_by text references users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  constraint board_owner_constraint check (
    (is_personal = true and organization_id is null) or
    (is_personal = false and organization_id is not null)
  )
);

-- Tareas
create table tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  title text not null,
  description text,
  status task_status default 'todo',
  order integer not null,
  assigned_to text references users(id) on delete set null,
  created_by text references users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  due_date timestamp with time zone
);

-- Comentarios en tareas
create table comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  author_id text references users(id),
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Active RLS
alter table boards enable row level security;
alter table tasks enable row level security;
alter table comments enable row level security;

-- Policies

-- Bords
-- SELECT (ver tableros personales y de su organización)
create policy "Select personal or org boards"
on boards for select
using (
  (is_personal = true and created_by = auth.jwt() ->> 'sub' and (auth.jwt() ->> 'org_id') is null) or
  (is_personal = false and organization_id::text = auth.jwt() ->> 'org_id')
);

-- INSERT
create policy "Insert personal or org boards"
on boards for insert
with check (
  (is_personal = true and created_by = auth.jwt() ->> 'sub') or
  (
    is_personal = false 
    and organization_id::text = auth.jwt() ->> 'org_id'
    and auth.jwt() ->> 'org_role' = 'org:admin'
  )
);

-- UPDATE
create policy "Update own or org boards"
on boards for update
using (
  (is_personal = true and created_by = auth.jwt() ->> 'sub' and (auth.jwt() ->> 'org_id') is null) or
  (
    is_personal = false 
    and organization_id::text = auth.jwt() ->> 'org_id'
    and auth.jwt() ->> 'org_role' = 'org:admin'
  )
);

-- DELETE
create policy "Delete own or org boards"
on boards for delete
using (
  (is_personal = true and created_by = auth.jwt() ->> 'sub' and (auth.jwt() ->> 'org_id') is null) or
  (
    is_personal = false 
    and organization_id::text = auth.jwt() ->> 'org_id'
    and auth.jwt() ->> 'org_role' = 'org:admin'
  )
);

-- Tasks
-- SELECT
create policy "Select tasks by board access"
on tasks for select
using (
  board_id in (
    select id from boards
    where (is_personal = true and created_by = auth.jwt() ->> 'sub')
       or (is_personal = false and organization_id::text = auth.jwt() ->> 'org_id')
  )
);

-- INSERT
create policy "Insert tasks in allowed boards"
on tasks for insert
with check (
  board_id in (
    select id from boards
    where (is_personal = true and created_by = auth.jwt() ->> 'sub')
       or (is_personal = false and organization_id::text = auth.jwt() ->> 'org_id')
  )
);

-- UPDATE
create policy "Update tasks in allowed boards"
on tasks for update
using (
  board_id in (
    select id from boards
    where (is_personal = true and created_by = auth.jwt() ->> 'sub')
       or (is_personal = false and organization_id::text = auth.jwt() ->> 'org_id')
  )
);

-- DELETE
create policy "Delete tasks in allowed boards"
on tasks for delete
using (
  board_id in (
    select id from boards
    where (is_personal = true and created_by = auth.jwt() ->> 'sub')
       or (is_personal = false and organization_id::text = auth.jwt() ->> 'org_id')
  )
);


-- Comments
-- SELECT
create policy "Select comments for visible tasks"
on comments for select
using (
  task_id in (
    select id from tasks
    where board_id in (
      select id from boards
      where (is_personal = true and created_by = auth.jwt() ->> 'sub')
         or (is_personal = false and organization_id::text = auth.jwt() ->> 'org_id')
    )
  )
);

-- INSERT
create policy "Insert comments for visible tasks"
on comments for insert
with check (
  task_id in (
    select id from tasks
    where board_id in (
      select id from boards
      where (is_personal = true and created_by = auth.jwt() ->> 'sub')
         or (is_personal = false and organization_id::text = auth.jwt() ->> 'org_id')
    )
  )
);

-- UPDATE (solo el autor puede editar)
create policy "Update own comments"
on comments for update
using (
  author_id = auth.jwt() ->> 'sub'
);

-- DELETE (solo el autor puede borrar)
create policy "Delete own comments"
on comments for delete
using (
  author_id = auth.jwt() ->> 'sub'
);

-- Triggers
-- Boards and tasks
create or replace function delete_tasks_on_board_delete()
returns trigger as $$
begin
  delete from tasks where board_id = old.id;
  return old;
end;
$$ language plpgsql;

create trigger on_board_delete_cascade_tasks
after delete on boards
for each row
execute procedure delete_tasks_on_board_delete();

-- Comments & tasks
create or replace function delete_comments_on_task_delete()
returns trigger as $$
begin
  delete from comments where task_id = old.id;
  return old;
end;
$$ language plpgsql;

create trigger on_task_delete_cascade_comments
after delete on tasks
for each row
execute procedure delete_comments_on_task_delete();

