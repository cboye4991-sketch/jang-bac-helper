#!/bin/bash
# Jàng — envoie la clé Dify de .env.local vers le secret Cloudflare DIFY_API_KEY, sans copier-coller.
# La clé ne s'affiche jamais à l'écran et ne quitte .env.local que vers Cloudflare.
set -e
cd "$(dirname "$0")"
NOM_APP="jang"

if [ ! -f .env.local ]; then
  echo "❌ .env.local introuvable à côté de package.json."
  echo "   Copiez la clé app-… dans Dify (Point d'accès → Clé API), puis dans ce dossier, dans le Terminal :"
  echo "   printf 'DIFY_API_KEY=%s\n' \"\$(pbpaste)\" > .env.local"
  read -r -p "Entrée pour fermer…"; exit 1
fi
CLE="$(grep -E '^DIFY_API_KEY=' .env.local | head -1 | cut -d= -f2- | tr -d '"'"'"' \r')"
if [ -z "$CLE" ] || [[ "$CLE" != app-* ]]; then
  echo "❌ DIFY_API_KEY vide ou ne commence pas par app- dans .env.local."
  read -r -p "Entrée pour fermer…"; exit 1
fi

printf '%s' "$CLE" | npx -y wrangler@4 secret put DIFY_API_KEY --name "$NOM_APP"
unset CLE
echo ""
npx -y wrangler@4 secret list --name "$NOM_APP"
echo "✅ DIFY_API_KEY doit apparaître ci-dessus. Rechargez le site et testez T1."
read -r -p "Appuyez sur Entrée pour fermer…"
