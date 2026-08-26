# Prompt: ERP para empreendimento de bikes elétricas

Copie e cole o conteúdo abaixo (a partir de "Contexto") na ferramenta que for usar
(v0, Lovable, Claude Code, etc). Ajuste os trechos entre `[colchetes]` antes de enviar.

---

## Contexto

Preciso de um ERP web para o meu empreendimento de **bikes elétricas**, que atua em
três frentes: **aluguel**, **venda** e **manutenção/assistência técnica**. O sistema
será usado por mim (administrador) e por vendedores/mecânicos da equipe.

Quero uma aplicação **Next.js (App Router, JavaScript) + Supabase (Postgres)**,
com **PWA** (instalável no celular, funciona bem em tela pequena), pronta para
deploy na **Vercel**. Interface em português do Brasil, tema escuro, mobile-first
(a maior parte do uso será pelo celular no balcão/oficina).

## Papéis de usuário

- **Administrador**: acesso total, vê financeiro consolidado e comissões de todos.
- **Vendedor**: registra aluguéis e vendas, vê apenas sua própria comissão.
- **Mecânico**: gerencia ordens de serviço e status da frota; não vê financeiro.

(Se autenticação/login completo for muito para a v1, pode começar sem login e eu
adiciono depois — mas deixe o modelo de dados já preparado para isso, com uma
coluna `usuario_id`/`papel` nas tabelas relevantes.)

## Módulos prioritários (construir primeiro, nesta ordem)

### 1. Financeiro e comissão de vendedores
- Registro de cada transação (aluguel ou venda) com: vendedor responsável, valor
  cobrado do cliente, valor base/custo, forma de pagamento (Dinheiro, PIX, Cartão
  de Débito, Cartão de Crédito), e comissão calculada automaticamente
  (`comissão = valor cobrado − valor base`, igual já uso no meu controle de
  aluguel de motos — reaproveite essa lógica).
- Dashboard financeiro: faturamento total, total de comissões, comissão por
  vendedor (ranking), filtro por período (dia/semana/mês) e por forma de pagamento.
- Fechamento de caixa diário (soma tudo do dia, separado por forma de pagamento).

### 2. Clientes e agendamentos
- Cadastro de cliente: nome, telefone/WhatsApp, e-mail opcional, histórico de
  aluguéis/vendas/manutenções.
- Agenda de horários para: retirada/devolução de bike alugada, entrega de bike
  vendida, e horário de manutenção na oficina.
- Visualização em lista e em calendário (dia/semana), com status (agendado,
  confirmado, concluído, cancelado).
- Notificação/lembrete simples (pode ser só um indicador visual de "hoje" e
  "atrasado" na v1; integração com WhatsApp fica para depois).

### 3. Controle de frota e manutenção
- Cadastro de cada bike elétrica: modelo, número de série/patrimônio, status
  (disponível, alugada, em manutenção, vendida, inativa), km rodado ou nível de
  bateria se aplicável, foto.
- Ordens de serviço de manutenção: bike, problema relatado, mecânico
  responsável, peças usadas, custo, status (aberta, em andamento, concluída),
  data de abertura/fechamento.
- Histórico de manutenção por bike (para saber quando revisar de novo).
- Alertas simples de manutenção preventiva (ex: a cada X km ou X dias).

## Módulos secundários (v2, deixar preparado mas não é prioridade agora)

- Catálogo e cadastro de vendas de bikes novas/seminovas (preço, modelo,
  condição), separado da frota de aluguel.
- Estoque de peças usadas na manutenção (entrada/saída, quantidade mínima).

## Modelo de dados sugerido (ajuste como achar melhor)

- `bikes` (id, modelo, patrimonio, status, foto_url, km_ou_bateria, created_at)
- `clientes` (id, nome, telefone, email, created_at)
- `vendedores` (id, nome) — ou reaproveitar tabela de usuários
- `tipos_transacao` (id, nome, valor_base) — ex: "Aluguel 1h", "Aluguel diária",
  "Venda bike X" — mesmo conceito de "tipos de aluguel" com valor base que já uso
- `transacoes` (id, tipo: aluguel/venda, bike_id, cliente_id, vendedor,
  tipo_transacao_id, valor_base, valor_cobrado, comissao, forma_pagamento,
  created_at)
- `agendamentos` (id, cliente_id, bike_id, tipo: retirada/devolução/entrega/
  manutenção, data_hora, status)
- `ordens_servico` (id, bike_id, mecanico, problema, pecas_usadas, custo,
  status, aberta_em, concluida_em)

## Requisitos técnicos

- Next.js App Router, componentes client onde precisar de interatividade.
- Supabase JS client, com Row Level Security habilitado (policies simples de
  início, endurecer depois se adicionar login).
- Script SQL de criação das tabelas em `supabase/schema.sql`.
- PWA: `manifest.json`, ícones (192/512), service worker básico para cache do
  app shell (sem cache de dados do Supabase, sempre buscar ao vivo).
- Sincronização em tempo real via Supabase Realtime nas telas de agenda e
  frota, para múltiplos dispositivos (dono + equipe) verem mudanças na hora.
- README com passo a passo de deploy (Supabase → variáveis de ambiente →
  Vercel), no mesmo padrão que já uso nos meus outros projetos.

## Fora de escopo por enquanto

- Integração com gateways de pagamento (é apenas registro do que foi cobrado).
- Login/autenticação completa (a não ser que a ferramenta já ofereça isso fácil).
- App nativo (só PWA).
