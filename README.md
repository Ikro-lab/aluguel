# Controle de Aluguel de Motos

App Next.js + Supabase para controlar aluguéis de motos, calcular a comissão do
vendedor automaticamente (valor cobrado − valor base do tipo de aluguel) e
acompanhar histórico, forma de pagamento e comissão por vendedor. Funciona como
PWA (dá para "instalar" no celular, incluindo Android TV/Google TV).

## 1. Criar o banco no Supabase

1. Crie uma conta gratuita em https://supabase.com e um novo projeto.
2. No painel do projeto, vá em **SQL Editor > New query**, cole o conteúdo do
   arquivo [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.
   Isso cria as tabelas `tipos_aluguel` e `alugueis`, já com os 3 tipos padrão
   (Meia hora R$55, 1 hora R$100, Diária R$300).
3. Vá em **Project Settings > API** e copie:
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
app/                 páginas (Next.js App Router)
components/          formulário, gerenciador de tipos, resumo, ranking, histórico
lib/supabaseClient.js  cliente do Supabase
lib/format.js        formatação de moeda e lista de formas de pagamento
supabase/schema.sql  script de criação das tabelas + dados padrão
public/manifest.json, sw.js, icons/  configuração do PWA
```

## Funcionalidades

- Cadastro de aluguel: vendedor, tipo, valor cobrado, forma de pagamento.
- Comissão calculada automaticamente (valor cobrado − valor base do tipo).
- Gerenciamento de tipos de aluguel: adicionar, editar nome/valor base, excluir
  (o nome do tipo fica gravado em cada aluguel, então editar ou excluir um tipo
  não altera o histórico já registrado).
- Resumo geral (faturado, comissões, quantidade) e ranking de comissão por
  vendedor.
- Histórico completo com filtro por vendedor e exclusão de registros.
- Sincronização em tempo real: se você tiver o app aberto em dois aparelhos
  (ex. celular do dono + celular de um vendedor), um aluguel registrado em um
  aparece automaticamente no outro.
