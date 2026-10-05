# Jàng: Your Bac Coach

Crée une application web complète appelée Jàng.



# CONTEXTE

Jàng (« apprendre » en wolof) est un correcteur d'exercices du Bac sénégalais pour les élèves de Terminale scientifique des lycées de région qui révisent seuls faute de professeur. L'élève envoie sa réponse à un exercice d'annale ; Jàng lui dit où est sa première erreur, pourquoi, et lui donne un exercice similaire — depuis le téléphone qu'il a déjà, avec très peu de data.



# PAGES À CRÉER (3 pages)

1. ACCUEIL

   → Header : logo emoji 📘 + nom « Jàng »

   → Hero : titre « Tu révises seul ? Jàng te dit où tu t'es trompé. » ; sous-titre « Envoie ta réponse à un exercice du Bac, reçois ta première erreur expliquée et un exercice pour t'entraîner. Gratuit, sans application à installer. » ; 2 boutons CTA : « Corriger un exercice » (vers Exercices) et « Je suis professeur bénévole » (vers Contact)

   → Section « Comment ça marche » en 3 étapes : 1. Choisis un exercice et note son ID (ex. JNG-PC-01) · 2. Envoie l'ID et ta réponse · 3. Reçois ta première erreur, la méthode et un exercice similaire

   → Section chiffres : « 14 exercices type Bac » · « 14 fiches de cours » · « < 100 Ko par correction »

   → Footer : « Projet étudiant GET 409 — Swiss UMEF University, Campus de Dakar · Corrigés en cours de validation par des professeurs »

2. EXERCICES

   → Liste de 6 cartes avec : ID, matière, chapitre, énoncé court, statut

   → Boutons de filtre : Tous | Chimie | Physique | Maths

   → Chaque carte a une pastille « Corrigé disponible » (vert) ou « En préparation » (rouge), et un bouton « Copier l'ID »

3. CONTACT

   → Titre : « Professeur ? Aidez-nous à valider les corrigés »

   → Formulaire : Nom complet, E-mail, Téléphone, Message

   → Bouton d'envoi vert #128C7E

   → Adresse : Swiss UMEF University — Campus de Dakar, Sénégal



# DESIGN

→ Couleur principale : #128C7E (vert WhatsApp foncé) · secondaire : #FFFFFF · accent : #25D366

→ Police : Inter · style moderne, épuré, rassurant, textes courts en français simple

→ Responsive mobile first (breakpoint 768px), lisible sur un écran de 360 px

→ Navigation fixe en haut avec les 3 pages

→ Aucune image lourde ni vidéo : nos utilisateurs ont très peu de data



# DONNÉES (6 exercices — ID | matière | chapitre | énoncé court | statut)

1. JNG-PC-01 | Chimie | Solutions et pH | 2,0 g de NaOH dans 500 mL : calcule C puis le pH | Corrigé disponible

2. JNG-PC-03 | Chimie | Acides faibles | pH d'une solution d'acide éthanoïque à 1,0×10⁻² mol/L (pKa = 4,8) | Corrigé disponible

3. JNG-MA-01 | Maths | Suites numériques | Étudier la convergence d'une suite récurrente | En préparation

4. JNG-PC-07 | Physique | Lois de Newton | Solide sur un plan incliné à 30° : accélération et vitesse après 2,0 m | Corrigé disponible

5. JNG-PC-10 | Physique | Dipôle RC | R = 10 kΩ, C = 100 µF : constante de temps et tension à t = τ | Corrigé disponible

6. JNG-PC-12 | Physique | Effet photoélectrique | Cellule au césium éclairée à 500 nm : énergie cinétique maximale | Corrigé disponible



# STACK TECHNIQUE

→ React + Tailwind CSS + Vite

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fd553123-1603-4db0-b806-2890795d217a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
