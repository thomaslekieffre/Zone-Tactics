# Supabase setup

## Variables d'environnement (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
```

## Appliquer la migration

Option A — via Supabase CLI (recommandé) :

```bash
npx supabase login
npx supabase link --project-ref <ref>
npx supabase db push
```

Option B — coller `migrations/20260510120000_initial_schema.sql` dans le SQL Editor du dashboard.

## Configuration Auth

Dans le dashboard Supabase → Authentication → URL Configuration :

- Site URL : `http://localhost:3000` (et l'URL prod)
- Redirect URLs : `http://localhost:3000/auth/callback`, `https://<prod>/auth/callback`

Optionnel : activer Google / Apple OAuth.

## Webhook Stripe

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Évents écoutés : `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`.
