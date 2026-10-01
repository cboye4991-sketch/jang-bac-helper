#!/bin/bash
# Jàng — mise en ligne sur Cloudflare Workers (tutoriel S5+ §4.6, piste 1). Double-cliquer dans le Finder.
# Étapes : récupérer le code → installer → compiler → connexion Cloudflare (1re fois) → déployer.
# npm et non bun : le bun.lock de Lovable pointe vers un registre privé (erreur 403).
set -e
cd "$(dirname "$0")"
NOM_APP="jang"

echo "▶ 1/5  git pull"
git pull --ff-only

echo "▶ 2/5  npm install"
npm install --no-audit --no-fund

echo "▶ 3/5  npm run build"
npm run build

echo "▶ 4/5  connexion Cloudflare"
if ! npx -y wrangler@4 whoami 2>/dev/null | grep -q "You are logged in"; then
  echo "   Le navigateur va s'ouvrir : cliquez tout de suite sur « Allow » (délai limité)."
  npx -y wrangler@4 login
fi

echo "▶ 5/5  déploiement du Worker « $NOM_APP »"
echo "   1re fois : « Would you like to register a workers.dev subdomain? » → Y, puis un nom court (ex. jang-sn)."
npx -y wrangler@4 deploy --name "$NOM_APP"

if ! npx -y wrangler@4 secret list --name "$NOM_APP" 2>/dev/null | grep -q DIFY_API_KEY; then
  echo ""
  echo "⚠  Le secret DIFY_API_KEY n'existe pas encore : double-cliquez sur cle_dify_cloudflare.command."
fi
echo ""
echo "✅ Terminé. Lien : https://$NOM_APP.<votre-sous-domaine>.workers.dev (attendre 1–2 min la 1re fois)."
read -r -p "Appuyez sur Entrée pour fermer…"
