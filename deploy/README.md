# Mise en ligne de Jàng — GitHub Pages + fonction Supabase

```
Élève → site statique (GitHub Pages) → fonction « corriger » (Supabase, garde la clé) → workflow Dify « jang »
```

GitHub Pages ne sert que des fichiers fixes : il ne peut pas garder de secret. La clé Dify est donc gardée par une
petite fonction Supabase (plan gratuit), jamais par le site. La version Lovable, elle, garde sa fonction serveur :
les deux coexistent (`VITE_CORRIGER_URL` vide = mode Lovable).

## 1. Fonction Supabase (une fois)

1. supabase.com → **Start your project** → connexion avec GitHub → **New project** (nom `jang`, région la plus proche : *West EU* ; mot de passe de base de données généré, à garder).
2. **Edge Functions** → **Deploy a new function** → **Via Editor** → nom **`corriger`** → remplacer le code par [`supabase-corriger/index.ts`](supabase-corriger/index.ts) → **Deploy function**.
3. Dans la fonction → **Details** (ou **Settings**) → désactiver **Verify JWT with legacy secret** → **Save**. (Le site n'a pas de connexion utilisateur.)
4. **Edge Functions** → **Secrets** → **Add new secret** : `DIFY_API_KEY` = la clé `app-…` du workflow Dify « jang » → **Save**. *Clé collée par l'équipe, jamais dans le code.*
5. Copier l'URL de la fonction : `https://<id-projet>.supabase.co/functions/v1/corriger`.

## 2. GitHub Pages (une fois)

1. Dépôt `jang-bac-helper` → **Settings** → **Pages** → Source : **GitHub Actions**.
2. **Settings** → **Secrets and variables** → **Actions** → onglet **Variables** → **New repository variable** : `CORRIGER_URL` = l'URL de l'étape 1.5.
3. Onglet **Actions** → **GitHub Pages** → **Run workflow** (ou simplement un `git push`).
4. Au bout de 2–3 min : **https://cboye4991-sketch.github.io/jang-bac-helper/**

## 3. Ensuite

Chaque `git push` sur `main` recompile et republie le site automatiquement (`.github/workflows/pages.yml`).

## Tester en local (VS Code)

```bash
npm install
npm run dev                         # version Lovable (fonction serveur, nécessite DIFY_API_KEY dans .env)
# ou, comme en ligne :
echo 'VITE_CORRIGER_URL=https://<id-projet>.supabase.co/functions/v1/corriger' > .env.local
npm run dev
```

`.env.local` est ignoré par Git (`*.local` dans `.gitignore`).
