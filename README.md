# ERP Bikes Elétricas

App Next.js + Supabase para gerenciar um negócio de aluguel de bikes/scooters
elétricas: aluguel com comissão automática (valor cobrado − valor base do
tipo), financeiro (faturamento, comissão por vendedor, fechamento de caixa),
clientes e agenda de retiradas/devoluções/manutenções, frota (status, foto,
km/bateria) e ordens de serviço. Funciona como PWA (dá para "instalar" no
celular, incluindo Android TV/Google TV).

## 1. Criar o banco no Supabase

1. Crie uma conta gratuita em https://supabase.com e um novo projeto.
2. No painel do projeto, vá em **SQL Editor > New query**, cole o conteúdo do
   arquivo [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.
   Isso cria todas as tabelas (tipos de aluguel, aluguéis, funcionários, vales,
   despesas, clientes, bikes, agendamentos, ordens de serviço), já com os 3
   tipos padrão de aluguel (Meia hora R$55, 1 hora R$100, Diária R$300).
3. Vá em **Storage** e crie um bucket novo chamado `bikes-fotos`, marcado como
   **Public bucket** — é onde ficam as fotos da frota.
4. Vá em **Project Settings > API** e copie:
   - `Project URL` → variável `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → variável `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   Essas são chaves públicas de cliente (não são segredos como uma senha), mas
   o acesso de escrita é controlado pelas *policies* de RLS definidas no script
   SQL — por padrão liberado para leitura/escrita, já que é um app interno de
   uso próprio. Se um dia expuser publicamente, adicione autenticação e troque
   as policies.

## 2. Rodar localmente

```bash
npm install
cp .env.local.example .env.local
# edite .env.local com as duas chaves do passo anterior
npm run dev
```

Abra http://localhost:3000

## 3. Publicar na Vercel

**Opção A — pelo site (mais simples):**

1. Suba este projeto para um repositório no GitHub (crie um repo vazio e faça
   `git init`, `git add .`, `git commit -m "inicial"`, `git remote add origin ...`,
   `git push`).
2. Em https://vercel.com, clique em **Add New > Project** e importe o repositório.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
4. Clique em **Deploy**.

**Opção B — pela CLI:**

```bash
npm install -g vercel
vercel login
vercel
# depois de configurar, defina as env vars também no dashboard da Vercel
vercel --prod
```

## 4. Instalar como PWA

Depois de publicado (PWA exige HTTPS, que a Vercel já fornece por padrão):

- **Android/Chrome**: abra o link, toque no menu (⋮) e em "Adicionar à tela
  inicial" / "Instalar app".
- **iPhone/Safari**: abra o link, toque em Compartilhar → "Adicionar à Tela
  de Início".
- **Google TV / Android TV**: abra pelo navegador (ex.: o Chrome ou o
  BrowseHere, se o TV não tiver Chrome completo) e use a opção de instalar/
  adicionar à tela inicial do navegador.

O app já vem com `manifest.json`, ícones e um service worker (`public/sw.js`)
que cacheia o "shell" do app para abrir mais rápido e funcionar minimamente
offline — os dados em si sempre vêm do Supabase ao vivo (não há sincronização
offline dos aluguéis, só leitura instantânea quando há rede).

## Estrutura

```
app/                 páginas (Next.js App Router): início, agenda, frota,
                     manutenção, clientes, faturamento, despesas, funcionários
components/          formulários, tabelas, gráficos e badges de status
lib/supabaseClient.js  cliente do Supabase
lib/useRealtimeTable.js  hook de leitura + sincronização em tempo real
lib/format.js        formatação, constantes de status e helpers de data/período
supabase/schema.sql  script de criação das tabelas + dados padrão
public/manifest.json, sw.js, icons/  configuração do PWA
```

## Funcionalidades

**Aluguel e financeiro**
- Cadastro de aluguel: vendedor, tipo, valor cobrado, forma de pagamento,
  cliente e bike (opcionais). Comissão calculada automaticamente (valor
  cobrado − valor base do tipo).
- Gerenciamento de tipos de aluguel, despesas por categoria e vale/adiantamento
  por funcionário (abate do saldo de comissão, bloqueado se exceder o saldo).
- Faturamento com filtro por período, gráficos mensais de faturamento e
  comissão (por funcionário ou time todo) e fechamento de caixa diário por
  forma de pagamento.

**Clientes e agenda**
- Cadastro de clientes com histórico de aluguéis e agendamentos.
- Agenda de retirada/devolução/entrega/manutenção em lista (com indicador de
  "hoje"/"atrasado") ou calendário semanal.

**Frota e manutenção**
- Cadastro de bikes com foto (upload para o Supabase Storage), status,
  km/bateria — o status muda automaticamente ao alugar ou abrir/concluir uma
  ordem de serviço.
- Ordens de serviço por bike (problema, peças, custo, mecânico) com alerta
  visual de revisão recomendada.

- Sincronização em tempo real: se você tiver o app aberto em dois aparelhos
  (ex. celular do dono + celular de um funcionário), uma mudança em um aparece
  automaticamente no outro.
