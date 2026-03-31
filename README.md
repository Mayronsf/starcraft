# StarCraft — A Gênese (site)

Landing page feita com **Vite + React + TypeScript + Tailwind**.

## Requisitos

- Node.js (LTS recomendado)

## Rodar localmente

```bash
npm install
npm run dev
```

Abra a URL mostrada no terminal (normalmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy na Vercel

### Opção A) Pelo painel da Vercel (recomendado)

1. Suba o projeto para um repositório no GitHub (já está em `main`).
2. Na Vercel, clique em **Add New → Project** e selecione o repositório.
3. Configure:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Clique em **Deploy**.

### Opção B) Pela CLI da Vercel

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Funcionalidades adicionadas

- **CTA "ENTRAR NO MUNDO"**: abre WhatsApp com mensagem pré-definida em nova aba.
- **Link "Regras"**: abre modal com overlay, fechamento por X/overlay/Esc e bloqueia scroll do fundo.
- **Link "Discord"**: abre convite do Discord em nova aba.

