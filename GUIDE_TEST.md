# 🧪 Guide de Test - StatusMarket

Ce guide vous explique comment tester l'application StatusMarket de A à Z.

## 🎯 Résumé rapide : Comment s'inscrire

**En 3 étapes simples :**

1. **Ouvrez** http://localhost:5173
2. **Cliquez** sur le bouton **"Login / Register"** (en haut à droite)
3. **Cliquez** sur **"Register"** puis remplissez le formulaire (4 champs)

👉 **Détails complets ci-dessous dans la section "Étape 5 : Tests fonctionnels"**

## 📋 Prérequis

1. **Node.js 18+** installé
2. **PostgreSQL** installé et démarré (ou compte Neon/Railway)
3. **Compte Cloudinary** (gratuit) pour les images

---

## 🚀 Étape 1 : Configuration de l'environnement

### 1.1 Variables d'environnement Backend

Créez le fichier `backend/.env` :

```bash
cd backend
copy env.example .env
```

Puis éditez `backend/.env` avec vos valeurs :

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/statusmarket
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=votre-email@example.com
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
CLOUDINARY_FOLDER=statusmarket
```

**Important :**
- Remplacez `DATABASE_URL` par votre chaîne de connexion PostgreSQL
- Générez un `JWT_SECRET` aléatoire (ex: `openssl rand -hex 32`)
- Utilisez votre email pour `ADMIN_EMAIL` (vous serez admin automatiquement)
- Obtenez vos clés Cloudinary sur https://cloudinary.com

### 1.2 Variables d'environnement Frontend

Créez le fichier `frontend/.env` :

```bash
cd frontend
copy env.example .env
```

Puis éditez `frontend/.env` :

```env
VITE_API_URL=http://localhost:5000
```

---

## 🗄️ Étape 2 : Base de données

### 2.1 Créer la base de données

Connectez-vous à PostgreSQL et créez la base :

```sql
CREATE DATABASE statusmarket;
```

### 2.2 Exécuter les migrations

Depuis le dossier `backend` :

```bash
cd backend
npm run prisma:migrate
```

Cela va :
- Créer les tables (User, Listing)
- Générer le client Prisma

Si vous avez déjà une base, utilisez :

```bash
npm run prisma:deploy
```

---

## 📦 Étape 3 : Installation des dépendances

### 3.1 Backend

```bash
cd backend
npm install
```

### 3.2 Frontend

```bash
cd frontend
npm install
```

---

## ▶️ Étape 4 : Lancer l'application

### 4.1 Démarrer le Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
Server running on port 5000
```

Testez l'API :
- Ouvrez http://localhost:5000/health
- Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### 4.2 Démarrer le Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Vous devriez voir :
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## ✅ Étape 5 : Tests fonctionnels

### 5.1 Test 1 : Créer un compte Admin

**Comment accéder à la page d'inscription :**

1. Ouvrez http://localhost:5173 dans votre navigateur
2. **En haut à droite**, vous verrez un bouton **"Login / Register"** (ou dans le menu mobile ☰)
3. Cliquez sur ce bouton pour aller à la page d'authentification

**Sur la page d'authentification (`/auth`) :**

4. Vous verrez **deux boutons** en haut du formulaire : **"Login"** et **"Register"**
5. Cliquez sur le bouton **"Register"** (il devient blanc avec le texte en couleur)
6. Le formulaire change et affiche maintenant **4 champs** :
   - **Name** : Votre nom complet
   - **WhatsApp number** : Votre numéro WhatsApp (ex: +33612345678)
   - **Email** : Utilisez l'email que vous avez mis dans `ADMIN_EMAIL` du fichier `.env`
   - **Password** : Un mot de passe (minimum 6 caractères)

7. Remplissez tous les champs :
   ```
   Name: Votre Nom
   WhatsApp number: +33612345678
   Email: votre-email@example.com (celui dans ADMIN_EMAIL)
   Password: password123
   ```

8. Cliquez sur le bouton **"Create account"** en bas du formulaire
9. ✅ Vous devriez voir un message de succès et être redirigé vers `/dashboard`
10. ✅ Vous êtes maintenant connecté en tant qu'admin (si l'email correspond à `ADMIN_EMAIL`)

**💡 Astuce :** Si vous êtes déjà sur la page `/auth` mais que vous voyez le formulaire de connexion (seulement Email et Password), cliquez simplement sur le bouton **"Register"** en haut pour basculer vers le formulaire d'inscription.

### 5.2 Test 2 : Créer une annonce

1. Depuis le dashboard, cliquez sur "Create new listing"
2. Remplissez :
   - **Title** : "iPhone 13 Pro Max"
   - **Category** : "Electronics"
   - **Price** : 800
   - **Location** : "Paris, France"
   - **Description** : "Excellent état, boîte d'origine incluse"
   - **Images** : Ajoutez 1-5 images (glissez-déposez ou cliquez)
3. Cliquez sur "Save listing"
4. ✅ L'annonce apparaît dans votre dashboard

### 5.3 Test 3 : Voir l'annonce publiquement

1. Retournez à la page d'accueil (cliquez sur le logo)
2. ✅ Votre annonce devrait apparaître dans la liste
3. Cliquez sur l'annonce pour voir les détails
4. ✅ Vérifiez que le bouton "Contact seller on WhatsApp" fonctionne

### 5.4 Test 4 : Recherche et filtres

1. Sur la page d'accueil, utilisez la barre de recherche
2. Testez les filtres :
   - **Category** : Sélectionnez "Electronics"
   - **Location** : Tapez "Paris"
   - **Price range** : Définissez min/max
3. ✅ Les résultats se filtrent en temps réel

### 5.5 Test 5 : Modifier une annonce

1. Allez dans `/dashboard`
2. Cliquez sur "Edit" sur une de vos annonces
3. Modifiez le titre ou le prix
4. Cliquez sur "Save listing"
5. ✅ Les modifications sont sauvegardées

### 5.6 Test 6 : Supprimer une annonce

1. Dans `/dashboard`, cliquez sur "Delete"
2. Confirmez
3. ✅ L'annonce disparaît de la liste publique

### 5.7 Test 7 : Profil public

1. Créez un deuxième compte (déconnectez-vous d'abord)
2. Créez quelques annonces avec ce compte
3. Cliquez sur le nom du vendeur dans une annonce
4. ✅ Vous voyez le profil public avec toutes ses annonces

### 5.8 Test 8 : Panel Admin

1. Connectez-vous avec votre compte admin (`ADMIN_EMAIL`)
2. Allez sur `/admin`
3. ✅ Vous voyez :
   - Liste de tous les utilisateurs
   - Liste de toutes les annonces
   - Boutons pour supprimer utilisateurs/annonces

### 5.9 Test 9 : Paramètres utilisateur

1. Allez sur `/settings`
2. Modifiez votre nom, numéro WhatsApp, localisation
3. Ajoutez une photo de profil (avatar)
4. Cliquez sur "Save changes"
5. ✅ Les modifications sont sauvegardées

---

## 🐛 Dépannage

### Erreur : "Cannot connect to database"

**Solution :**
- Vérifiez que PostgreSQL est démarré
- Vérifiez votre `DATABASE_URL` dans `backend/.env`
- Testez la connexion : `psql -U postgres -d statusmarket`

### Erreur : "JWT_SECRET is required"

**Solution :**
- Vérifiez que `backend/.env` existe et contient `JWT_SECRET`
- Redémarrez le serveur backend

### Erreur : "CORS error" dans le navigateur

**Solution :**
- Vérifiez que `CLIENT_URL` dans `backend/.env` correspond à l'URL du frontend
- Par défaut : `http://localhost:5173`

### Erreur : "Cloudinary upload failed"

**Solution :**
- Vérifiez vos clés Cloudinary dans `backend/.env`
- Testez vos clés sur https://cloudinary.com/console

### Les images ne s'affichent pas

**Solution :**
- Vérifiez que Cloudinary est bien configuré
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que les URLs Cloudinary sont valides

### Le frontend ne se connecte pas à l'API

**Solution :**
- Vérifiez que `VITE_API_URL` dans `frontend/.env` est `http://localhost:5000`
- Vérifiez que le backend tourne sur le port 5000
- Redémarrez le serveur frontend après modification de `.env`

### Je ne trouve pas le bouton pour m'inscrire

**Solution :**
- Le bouton **"Login / Register"** est en haut à droite de la page d'accueil
- Sur mobile, cliquez sur le menu ☰ (hamburger) en haut à droite
- Une fois sur la page `/auth`, vous verrez deux boutons : **"Login"** et **"Register"**
- Cliquez sur **"Register"** pour voir le formulaire d'inscription (4 champs)
- Si vous voyez seulement 2 champs (Email/Password), vous êtes en mode "Login" - cliquez sur "Register"

### Erreur lors de l'inscription : "Email already exists"

**Solution :**
- Cet email est déjà utilisé
- Utilisez un autre email ou connectez-vous avec cet email existant
- Pour tester, utilisez un email différent

### Erreur lors de l'inscription : "Validation failed"

**Solution :**
- Vérifiez que tous les champs sont remplis
- Le mot de passe doit faire au moins 6 caractères
- L'email doit être valide (format email@domain.com)
- Le nom doit faire au moins 2 caractères
- Le numéro WhatsApp doit faire au moins 6 caractères

---

## 📝 Checklist de test complète

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] `/health` retourne OK
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Création d'annonce fonctionne
- [ ] Upload d'images fonctionne
- [ ] Affichage des annonces fonctionne
- [ ] Recherche fonctionne
- [ ] Filtres fonctionne
- [ ] Modification d'annonce fonctionne
- [ ] Suppression d'annonce fonctionne
- [ ] Profil public fonctionne
- [ ] Bouton WhatsApp fonctionne
- [ ] Panel admin accessible (si admin)
- [ ] Paramètres utilisateur fonctionnent
- [ ] Responsive mobile fonctionne

---

## 🎯 Tests API avec cURL (optionnel)

### Tester l'inscription

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "whatsappNumber": "+33612345678"
  }'
```

### Tester la connexion

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copiez le `token` de la réponse, puis :

### Tester la liste des annonces

```bash
curl http://localhost:5000/api/listings
```

### Tester la création d'annonce (avec token)

```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "title": "Test Listing",
    "price": 100,
    "category": "Test",
    "description": "This is a test listing",
    "location": "Paris",
    "images": ["data:image/png;base64,iVBORw0KGgoAAAANS..."]
  }'
```

---

## 🎉 C'est tout !

Votre application StatusMarket est maintenant fonctionnelle et testée. 

Pour toute question, consultez le `README.md` principal.


