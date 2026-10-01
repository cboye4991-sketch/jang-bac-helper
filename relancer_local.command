#!/bin/bash
# Jàng — routine de début de séance (tutoriel S5+ §4.5) : récupérer, installer, lancer en local.
# Ctrl+C pour arrêter le serveur. La clé locale est lue dans .env.local (jamais commité).
cd "$(dirname "$0")" && git pull --ff-only && npm install --no-audit --no-fund && npm run dev
