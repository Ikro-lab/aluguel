-- Schema do Controle de Aluguel de Motos
-- Execute este script no SQL Editor do Supabase (Project > SQL Editor > New query)

create table if not exists tipos_aluguel (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  valor_base numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists alugueis (
  id uuid primary key default gen_random_uuid(),
  vendedor text not null,
  tipo_id uuid references tipos_aluguel(id) on delete set null,
  tipo_nome text not null,
  valor_base numeric(10,2) not null,
  valor_cobrado numeric(10,2) not null,
  comissao numeric(10,2) not null,
  forma_pagamento text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_alugueis_vendedor on alugueis(vendedor);
create index if not exists idx_alugueis_created_at on alugueis(created_at desc);

-- Tipos de aluguel padrão
insert into tipos_aluguel (nome, valor_base)
select * from (values
  ('Meia hora', 55.00),
  ('1 hora', 100.00),
  ('Diária', 300.00)
) as v(nome, valor_base)
where not exists (select 1 from tipos_aluguel);

create table if not exists funcionarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists vales (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references funcionarios(id) on delete cascade,
  valor numeric(10,2) not null,
  descricao text,
  created_at timestamptz not null default now()
);

create table if not exists despesas (
  id uuid primary key default gen_random_uuid(),
  categoria text not null,
  descricao text,
  valor numeric(10,2) not null,
  data date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_vales_funcionario on vales(funcionario_id);
create index if not exists idx_vales_created_at on vales(created_at desc);
create index if not exists idx_despesas_data on despesas(data desc);

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists bikes (
  id uuid primary key default gen_random_uuid(),
  modelo text not null,
  patrimonio text,
  status text not null default 'disponivel',
  km_atual numeric(10,2),
  nivel_bateria numeric(5,2),
  foto_url text,
  created_at timestamptz not null default now()
);

create table if not exists agendamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete set null,
  bike_id uuid references bikes(id) on delete set null,
  tipo text not null,
  data_hora timestamptz not null,
  status text not null default 'agendado',
  observacao text,
  created_at timestamptz not null default now()
);

create table if not exists ordens_servico (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid references bikes(id) on delete set null,
  mecanico text,
  problema text not null,
  pecas_usadas text,
  custo numeric(10,2) not null default 0,
  status text not null default 'aberta',
  aberta_em timestamptz not null default now(),
  concluida_em timestamptz
);

alter table alugueis add column if not exists cliente_id uuid references clientes(id) on delete set null;
alter table alugueis add column if not exists bike_id uuid references bikes(id) on delete set null;

-- Agendamento público (link + QR code): status também usa
-- 'aguardando_confirmacao' e 'recusado' além dos valores internos.
alter table agendamentos add column if not exists codigo_agendamento text;
alter table agendamentos add column if not exists tempo_uso text;
alter table agendamentos add column if not exists endereco jsonb;
create unique index if not exists idx_agendamentos_codigo on agendamentos(codigo_agendamento);

create index if not exists idx_agendamentos_data on agendamentos(data_hora);
create index if not exists idx_agendamentos_bike on agendamentos(bike_id);
create index if not exists idx_ordens_servico_bike on ordens_servico(bike_id);
create index if not exists idx_ordens_servico_status on ordens_servico(status);

-- Row Level Security
-- Este é um app interno/single-tenant controlado pela chave anon.
-- Liberamos leitura/escrita geral aqui; se depois você adicionar login,
-- troque estas policies para restringir por usuário autenticado.
alter table tipos_aluguel enable row level security;
alter table alugueis enable row level security;
alter table funcionarios enable row level security;
alter table vales enable row level security;
alter table despesas enable row level security;
alter table clientes enable row level security;
alter table bikes enable row level security;
alter table agendamentos enable row level security;
alter table ordens_servico enable row level security;

drop policy if exists "tipos_aluguel_all" on tipos_aluguel;
create policy "tipos_aluguel_all" on tipos_aluguel for all using (true) with check (true);

drop policy if exists "alugueis_all" on alugueis;
create policy "alugueis_all" on alugueis for all using (true) with check (true);

drop policy if exists "funcionarios_all" on funcionarios;
create policy "funcionarios_all" on funcionarios for all using (true) with check (true);

drop policy if exists "vales_all" on vales;
create policy "vales_all" on vales for all using (true) with check (true);

drop policy if exists "despesas_all" on despesas;
create policy "despesas_all" on despesas for all using (true) with check (true);

drop policy if exists "clientes_all" on clientes;
create policy "clientes_all" on clientes for all using (true) with check (true);

drop policy if exists "bikes_all" on bikes;
create policy "bikes_all" on bikes for all using (true) with check (true);

drop policy if exists "agendamentos_all" on agendamentos;
create policy "agendamentos_all" on agendamentos for all using (true) with check (true);

drop policy if exists "ordens_servico_all" on ordens_servico;
create policy "ordens_servico_all" on ordens_servico for all using (true) with check (true);

-- Storage: crie manualmente um bucket público chamado "bikes-fotos"
-- (Project > Storage > New bucket > Public bucket: ON) para as fotos da frota.
-- "Public bucket" só libera LEITURA. Upload (INSERT) sempre precisa de uma
-- policy própria em storage.objects, mesmo em bucket público — por isso:
drop policy if exists "bikes_fotos_all" on storage.objects;
create policy "bikes_fotos_all" on storage.objects for all
  using (bucket_id = 'bikes-fotos')
  with check (bucket_id = 'bikes-fotos');
