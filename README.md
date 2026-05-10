# Zone Tactics

Plateforme SaaS pour coachs de basketball : crée, anime et partage des tactiques. Mobile-first, drag-and-drop tactile, commentaires audio, partage par lien.

## Stack

- **Next.js 16** (App Router, Server Actions, RSC, Turbopack)
- **React 19** + **TypeScript** strict
- **Supabase** (Auth + Postgres + Storage + RLS)
- **react-konva** (canvas tactile, animations tweens)
- **Zustand** (état éditeur, autosave localStorage)
- **shadcn/ui** + Radix + Tailwind + sonner + vaul
- **Stripe** (abonnements, webhooks)
- **Zod** (validation client + serveur)
- **Vitest** pour les tests unitaires

## Démarrage rapide

### 1. Installer

```bash
npm install
```

### 2. Variables d'environnement

Copie `.env.example` vers `.env.local` et remplis :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Dev only : tout gratuit sans Stripe (création tactiques + sauvegarde)
DISABLE_PAID_GATE=true

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_ID=
```

### 3. Configurer Supabase

Crée un projet sur [supabase.com](https://supabase.com), puis applique la migration :

```bash
# Option A : via Supabase CLI
npx supabase link --project-ref <ref>
npx supabase db push

# Option B : copier-coller supabase/migrations/20260510120000_initial_schema.sql
# dans le SQL Editor du dashboard
```

Dans **Authentication → URL Configuration** :
- Site URL : `http://localhost:3000`
- Redirect URLs : `http://localhost:3000/auth/callback`

### 4. Configurer Stripe

```bash
# Local : forward webhook
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Le secret renvoyé va dans STRIPE_WEBHOOK_SECRET
```

Crée un produit récurrent dans le dashboard Stripe, et mets son `price_id` dans `NEXT_PUBLIC_STRIPE_PRICE_ID`.

### 5. Lancer

```bash
npm run dev
# http://localhost:3000
```

## Scripts

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de dev (Turbopack) |
| `npm run build` | Build production |
| `npm start` | Serveur production |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:watch` | Tests en watch mode |
| `npm run type-check` | Vérification TypeScript |
| `npm run lint` | ESLint |

## Architecture

```
src/
├── app/
│   ├── (marketing)/         # landing
│   ├── (auth)/              # login + signup
│   ├── (app)/               # protégé : library, tactic, profile, pricing, admin
│   ├── share/[slug]/        # partage public
│   ├── auth/                # callback OAuth + signout
│   └── api/                 # stripe, audio
├── features/tactic/
│   ├── components/          # Court (Konva), Player, Arrow, Ball, Toolbar, Timeline...
│   ├── hooks/useTacticStore.ts  # Zustand + persist
│   └── lib/                 # types, validation Zod, geometry, playback
├── components/
│   ├── ui/                  # shadcn primitives
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── UserMenu.tsx
├── lib/
│   ├── supabase/            # client + server + middleware + types
│   ├── stripe.ts
│   ├── subscription.ts
│   └── utils.ts
└── proxy.ts                 # Next 16 : session Supabase + auth gate
```

### Coordonnées normalisées

Toutes les positions (joueurs, ballon, mouvements) sont stockées en `[0, 1]` plutôt qu'en pixels. Le rendu Konva fait `x * stageWidth`. Conséquence : l'éditeur est **réellement** responsive — la même tactique s'affiche correctement sur mobile portrait, tablette landscape, et desktop ultra-wide, sans recalcul ni décalage.

### Sécurité

- **RLS** sur toutes les tables : un user n'accède qu'à ses propres tactiques sauf si elles ont été partagées via un slug.
- **Stripe webhook** : signature vérifiée, mises à jour de `subscriptions` uniquement via le `service_role` côté webhook.
- **Storage audio** : bucket privé, accès via signed URL (10min) avec autorisation owner OU tactique partagée.
- **Server actions** : vérifient l'abonnement actif avant toute mutation.

### Mobile

- Pointer events natifs (Konva) → souris + tactile sans dépendance.
- `viewport user-scalable=no` pour éviter le pinch-zoom natif qui interfère.
- Drawer (vaul) pour la palette joueurs sur mobile.
- Toolbar flottante en bas, gestion du `safe-area-inset-bottom`.

## Publier sur GitHub

1. **Secrets** : `.gitignore` exclut `.env` et les variantes locales ; ne versionne que `.env.example`. Ne commite jamais de clés Supabase, Stripe, etc.
2. **Premier clone** : `cp .env.example .env` puis remplir localement.
3. **CI** : `.github/workflows/ci.yml` exécute sur chaque push / PR (`main` ou `master`) : `npm ci`, lint, `type-check`, tests Vitest, `next build` avec des variables factices. Les *warnings* ESLint ne font pas échouer le workflow.
4. **Prod** : variables réelles uniquement dans l’hébergeur (Vercel, etc.), pas dans git.

## Hors scope (roadmap)

- Export vidéo serveur (Remotion)
- Realtime collaboration (Supabase Realtime)
- Bibliothèque publique / feed de tactiques
- PWA offline-first
- AI assist (texte → tactique)

## Licence

MIT
