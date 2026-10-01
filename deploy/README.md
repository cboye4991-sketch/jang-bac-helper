# Mise en ligne de Jàng hors Lovable

Deux voies, la clé Dify ne quitte jamais le serveur dans les deux cas.

| | Voie 1 — **Cloudflare Workers** (recommandée, tutoriel S5+ §4.6 piste 1) | Voie 2 — GitHub Pages + fonction Supabase |
|---|---|---|
| Ce qui est hébergé | toute l'application, fonction serveur `corriger` comprise | le site statique sur GitHub Pages, la fonction sur Supabase |
| Modification du code | aucune (le build produit déjà un Worker, preset Nitro `cloudflare-module`) | build `GITHUB_PAGES=1` + `VITE_CORRIGER_URL` |
| Où vit la clé | secret Cloudflare `DIFY_API_KEY` | secret Supabase `DIFY_API_KEY` |
| Lien | `https://jang.<sous-domaine>.workers.dev` | `https://cboye4991-sketch.github.io/jang-bac-helper/` |

---

## Voie 1 — Cloudflare Workers (macOS, double-clic)

Prérequis : Node.js LTS, Git ; un compte Cloudflare gratuit (dash.cloudflare.com → Sign up, sans carte bancaire).

1. **Clé en local, sans copier-coller dans un chat :** Dify → jang → **Point d'accès** (Accès API) → **Clé API** → copier `app-…`. Puis dans le Terminal, dans ce dossier :
   ```bash
   printf 'DIFY_API_KEY=%s\n' "$(pbpaste)" > .env.local
   ```
   `.env.local` est ignoré par Git (`*.local`). Vérifier avec `git status` : il ne doit pas apparaître.
2. Double-cliquer **`deployer_jang.command`** (1re fois : clic droit → Ouvrir, macOS demande confirmation).
   - `wrangler login` ouvre le navigateur : cliquer **Allow** tout de suite (délai limité).
   - *« Would you like to register a workers.dev subdomain? »* → `Y` → nom court (ex. `jang-sn`) → `Y`.
3. Double-cliquer **`cle_dify_cloudflare.command`** : lit la clé dans `.env.local` et l'envoie à `wrangler secret put` (jamais affichée). `DIFY_API_KEY` doit apparaître dans la liste.
4. Ouvrir le lien affiché (attendre 1–2 min la 1re fois), lancer T1 depuis la page Exercices, puis depuis un **autre appareil** (téléphone en 4G).

**Mises à jour :** `git pull` puis double-clic sur `deployer_jang.command` (le secret est conservé).

| Piège | Cause | Correction |
|---|---|---|
| `Timed out waiting for authorization code` | Allow cliqué trop tard | relancer le script, cliquer Allow immédiatement |
| Le chat affiche « Clé API absente du serveur » | secret absent ou vide | relancer `cle_dify_cloudflare.command` |
| Marche en local, pas en ligne | les secrets Lovable ne sont pas copiés chez Cloudflare | étape 3 |
| `bun install` → erreur 403 | `bun.lock` pointe vers le registre privé Lovable | les scripts utilisent `npm install` |

## Travailler en local (tutoriel §4.5)

Double-cliquer **`relancer_local.command`** (= `git pull && npm install && npm run dev`), ouvrir `http://localhost:8080` (ou le port affiché). La clé est lue dans `.env.local`. Ctrl+C pour arrêter.

Claude Code dans un second terminal : `claude`, premier message : *« Lis AGENTS.md, package.json et src/lib/corriger.functions.ts. Résume la stack et le circuit Dify → application. Ne modifie rien. »* Refuser toute commande qui lirait `.env.local`, ferait `git add .` ou `git push --force`.

Avant chaque commit : `git status`, puis `git add <fichiers>` un par un (jamais `src/routeTree.gen.ts`).

---

## Voie 2 — GitHub Pages + fonction Supabase

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
