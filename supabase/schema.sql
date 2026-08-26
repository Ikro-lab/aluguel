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

-- Row Level Security
-- Este é um app interno/single-tenant controlado pela chave anon.
-- Liberamos leitura/escrita geral aqui; se depois você adicionar login,
-- troque estas policies para restringir por usuário autenticado.
alter table tipos_aluguel enable row level security;
alter table alugueis enable row level security;

drop policy if exists "tipos_aluguel_all" on tipos_aluguel;
create policy "tipos_aluguel_all" on tipos_aluguel for all using (true) with check (true);

drop policy if exists "alugueis_all" on alugueis;
create policy "alugueis_all" on alugueis for all using (true) with check (true);
