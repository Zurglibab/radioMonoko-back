# Documentation Technique - Infrastructure Backend RadioMonoko

## Sommaire
- [1. Vue d'ensemble de l'architecture](#1-vue-densemble-de-larchitecture)
- [2. Principaux Groupes d'Endpoints (API REST)](#2-principaux-groupes-dendpoints-api-rest)
- [3. Pourquoi ce système ? (Choix Techniques)](#3-pourquoi-ce-système--choix-techniques)
- [4. L'articulation du système (Le Workflow Détaillé)](#4-larticulation-du-système-le-workflow-détaillé)
- [5. Sécurité et Authentification (OAuth & JWT)](#5-sécurité-et-authentification-oauth--jwt)
- [6. Stratégie de Déploiement](#6-stratégie-de-déploiement)
- [7. Architecture et passage à grande échelle](#7-architecture-et-passage-à-grande-échelle)
  - [7.1 État Actuel : Environnement de Développement](#71-état-actuel--environnement-de-développement)
  - [7.2 Infrastructure Haute Disponibilité à Grande Échelle](#72-infrastructure-haute-disponibilité-à-grande-échelle)
- [8. Comment démarrer le projet (Guide de Développement)](#8-comment-démarrer-le-projet-guide-de-développement)
- [9. Comment tester l'API manuellement (Swagger)](#9-comment-tester-lapi-manuellement-swagger)
- [10. Tests Automatisés et Qualité du Code](#10-tests-automatisés-et-qualité-du-code)
- [11. Intégration de l'API Externe (Radio France)](#11-intégration-de-lapi-externe-radio-france)

---

## 1. Vue d'ensemble de l'architecture

Le backend de RadioMonoko est construit sur une architecture moderne, robuste et modulaire orientée services (N-Tier). Il utilise **Node.js** avec **TypeScript** et s'appuie sur le framework **Express.js**.

L'objectif de cette architecture est de séparer clairement les responsabilités (Separation of Concerns) afin de faciliter la maintenance, les tests et l'évolution de la base de code.

### Composants principaux :
1. **API REST (Express)** : Gère les requêtes HTTP entrantes, le routage et l'authentification.
2. **WebSockets (Socket.io)** : Gère les connexions temps réel pour les fonctionnalités de messagerie, de chaînes et de notifications asynchrones.
3. **Base de données Relationnelle (PostgreSQL)** : Stockage persistant structuré (utilisateurs, contenus, collections, avis, relations, etc.).
4. **Cache & In-Memory Store (Redis)** : Utilisé pour optimiser les performances, soulager la base de données (mise en cache) et gérer les états éphémères (ex: liste noire de tokens).
5. **Tâches Planifiées (Cron Jobs)** : Schedulers asynchrones (`brandsScheduler`, `messageScheduler`) qui s'exécutent en arrière-plan pour synchroniser des données ou traiter des flux continus.

---

## 2. Principaux Groupes d'Endpoints (API REST)

L'API est structurée autour de plusieurs ressources métier. Voici les grands groupes d'endpoints disponibles et leurs fonctions principales :

### 🔐 Authentification (`/auth`)
- **Fonction** : Gère la connexion, la création de tokens JWT, et la déconnexion.
- **Points d'entrée clés** :
  - `GET /auth/google` : Initie la connexion via Google OAuth.
  - `POST /auth/google-mobile` : Connexion Google pour l'application mobile (prend `googleToken` en Body).
  - `POST /auth/logout` : Révoque le token actuel.

### 📚 Collections (`/collections`, `/collectionItems`)
- **Fonction** : Permet aux utilisateurs de créer et gérer des listes de contenus (ex: "À écouter plus tard", "Favoris").
- **Points d'entrée clés** :
  - `POST /collections` : Création d'une collection. Paramètres requis dans le Body : `name` (string), et optionnellement `description` (string), `is_public` (boolean).
  - `POST /collectionItems` : Ajoute une émission spécifique à une collection. Paramètres requis : `collection_id` et `content_id`.
  - `GET /collections/user/:userId` : Récupère toutes les collections d'un utilisateur.

### 👤 Utilisateurs & Relations (`/user`, `/userRelation`)
- **Fonction** : Gestion des profils utilisateurs et des interactions sociales (système de Follow).
- **Points d'entrée clés** :
  - `GET /user/:id` : Récupère les informations d'un utilisateur spécifique.
  - `POST /userRelation` : Permet de s'abonner à un autre utilisateur. Paramètre requis : `followed_id`.

### 📻 Contenus & Notes (`/content`, `/ratingContent`)
- **Fonction** : Catalogue principal des émissions, diffusions et gestion de leurs notations.
- **Points d'entrée clés** :
  - `GET /content` : Liste et recherche de contenus (filtres possibles via Query Parameters).
  - `POST /ratingContent` : Laisser une note sur une émission. Paramètres requis : `content_id` et `rating` (nombre).

### 💬 Avis et Commentaires (`/review`)
- **Fonction** : Permet aux utilisateurs de débattre et donner leur avis textuel sur un contenu.
- **Points d'entrée clés** :
  - `POST /review` : Créer un nouvel avis. Paramètres requis : `content_id` et `comment`.
  - `POST /review/like` : Aimer ou ne plus aimer un avis existant (prend `review_id` en paramètre).

### ✉️ Messagerie & Notifications (`/channels`, `/notifications`)
- **Fonction** : Écosystème social et alertes en temps réel.
- **Points d'entrée clés** :
  - `POST /channels` : Créer un nouveau salon de discussion (paramètre : `type`).
  - `GET /notifications` : Récupère la liste des notifications (ex: nouveaux followers) de l'utilisateur connecté.

---

## 3. Pourquoi ce système ? (Choix Techniques)

Les choix technologiques ont été motivés par le besoin de performance, de sécurité et de scalabilité :

- **TypeScript** : Apporte un typage fort statique. Cela réduit considérablement les erreurs d'exécution, fiabilise les refactorisations et améliore l'auto-complétion (via les Interfaces et DTOs).
- **Express.js** : Un framework web léger et performant. Il permet d'intégrer facilement des middlewares de sécurité et de performance (Helmet pour les headers HTTP, Rate Limit contre les attaques de type DoS ou brute-force, Winston pour la journalisation des logs).
- **PostgreSQL via requêtes natives (`pg`)** : Contrairement à l'utilisation d'un ORM lourd (comme TypeORM ou Prisma) qui peut masquer la complexité et générer des requêtes sous-optimales, le choix du driver natif permet un contrôle total sur le SQL. La structure est garantie au démarrage par le fichier `src/database/db.ts` qui initialise le schéma.
- **Architecture en Couches (Routes -> Controllers -> Services -> Repositories/DAOs)** : Permet d'isoler la logique métier de la mécanique HTTP ou des spécificités de la base de données.
- **Swagger/OpenAPI** : Auto-documentation interactive exposée sur `/api/docs`. C'est un atout majeur pour la communication entre les développeurs backend et frontend.

---

## 4. L'articulation du système (Le Workflow Détaillé)

L'application suit un cycle de vie précis, garantissant que chaque composant joue un rôle exclusif. Voici le cheminement exact d'une requête HTTP :

1. **La Couche Réseau (Routes & Middlewares)** :
   - Le client (Web ou Mobile) effectue un appel API (ex: `POST /content`).
   - La requête passe d'abord par les **Middlewares Globaux** (Rate Limiter, CORS, Parser JSON).
   - Ensuite, elle passe par les **Middlewares Spécifiques** de la route, typiquement `authMiddleware` pour s'assurer que l'utilisateur est bien connecté.
   - Enfin, la requête est captée par l'`Express Router` qui la redirige vers la méthode appropriée du Controller.

2. **La Couche Présentation (Controllers)** :
   - Le Controller est le point d'entrée métier de la requête. Son seul rôle est de récupérer les informations de la requête (Body, Query params, `req.userId`), de valider ce format brut, puis d'appeler le *Service* approprié.
   - À la fin, le Controller s'occupe de renvoyer la réponse HTTP (statut `200`, `201`, `400`) au client sous un format standardisé.

3. **La Couche Métier (Services)** :
   - C'est le cœur de l'application. Le Service effectue toutes les vérifications métier (ex: "L'utilisateur a-t-il le droit de modifier ce contenu ?", "Ce contenu existe-t-il déjà ?").
   - Il orchestre les appels vers un ou plusieurs `Repositories` pour aller chercher ou enregistrer des données.

4. **La Couche d'Accès aux Données (Repositories & DAOs)** :
   - Le Repository (ou Data Access Object) contient les requêtes SQL (ex: `INSERT INTO...`, `SELECT * FROM...`). 
   - Cette couche interroge PostgreSQL et retourne les résultats bruts au Service.

5. **Transformations (Mappers & DTOs)** :
   - Avant d'être renvoyées au Controller, les données SQL brutes peuvent passer par des *Mappers* pour être formatées en *DTO (Data Transfer Objects)*. Cela permet de cacher des informations sensibles (comme le hash d'un mot de passe) avant l'envoi de la réponse JSON au client.

> [!TIP]
> En cas d'événements Temps Réel (WebSockets), les *Services* ou *Schedulers* émettent directement des messages vers la couche Socket (`SocketRegistry`), qui se charge de propager l'information aux clients connectés (ex: notifications instantanées).

---

## 5. Sécurité et Authentification (OAuth & JWT)

La sécurité est une priorité du backend, s'appuyant sur des standards industriels et des mécanismes de protection robustes.

### Authentification par Token (JWT - JSON Web Token)
Le système n'utilise pas de sessions stockées en mémoire serveur (Stateless). Au lieu de cela, l'API utilise des **JWT**.
1. **Création** : Lors d'une connexion réussie, un JWT est signé à l'aide d'un secret (`JWT_SECRET`). Ce token contient l'ID de l'utilisateur, son email, et son rôle (ex: admin ou user).
2. **Validation (`auth.middleware.ts`)** : Chaque route protégée demande un token dans les headers (`Authorization: Bearer <token>`). Le middleware vérifie la signature cryptographique du token et son expiration. Il vérifie également en base si l'utilisateur n'a pas été **banni**.

### Système de Login Hybride (Classique & OAuth Google)
L'API gère deux types d'authentification de manière unifiée :
1. **Login Classique** : Inscription par email/mot de passe. Les mots de passe sont hachés de manière asynchrone avec **Bcrypt** (`bcryptjs`) avant leur insertion en base.
2. **Google OAuth2 (Web & Mobile)** :
   - Via la bibliothèque `passport-google-oauth20`, un utilisateur peut se connecter avec Google. 
   - L'API gère de manière intelligente le **Web** (redirection classique OAuth) et le **Mobile** (`/auth/google-mobile`). Dans le cas mobile, le front-end récupère le token Google (`id_token` ou `access_token`) et l'envoie à l'API. L'API vérifie alors la validité de ce token directement auprès des serveurs de Google (via Axios) avant d'accepter l'utilisateur.
   - **Création à la volée** : Si un utilisateur se connecte via Google et que son email n'existe pas en base, le backend crée automatiquement son compte utilisateur.

### Révocation et Logout (Redis Blacklist)
Comme les JWT sont *Stateless* et ne peuvent pas être "détruits" côté serveur avant leur expiration naturelle, le backend utilise **Redis** pour gérer la déconnexion :
- Lors du log-out (`POST /auth/logout`), le JWT courant est ajouté dans une **Blacklist** stockée dans Redis, avec une durée de vie (TTL) égale au temps restant de validité du token.
- Lors des requêtes suivantes, le `authMiddleware` consulte Redis (`blacklist:${token}`). Si le token y figure, l'accès est refusé avec un `401 Unauthorized`.

---

## 6. Stratégie de Déploiement

L'infrastructure s'appuie massivement sur **Docker** pour garantir une parité stricte entre les environnements.

### A. Côté Développement (`docker-compose-dev.yml`)
- **Services montés par Docker** : **PostgreSQL** (`5432`) et **Redis** (`6379`).
- Le développeur lance l'API localement (`npm run dev`) avec le *Hot-Reloading* de `tsx`. L'infrastructure dépendante, elle, est bien cloisonnée dans Docker.

### B. Côté Production (`docker-compose.yml`)
- **Philosophie** : Un environnement clos, autonome et reproductible.
- **Services montés** :
  - **db** : PostgreSQL avec un volume persistant (`postgres_data`). Non exposé sur l'internet public.
  - **redis** : Cache in-memory confiné au réseau privé.
  - **api** : L'application Node.js.
- **Workflow de Build & CI/CD** : 
  - L'image de l'API est automatiquement construite via une intégration continue (GitHub Actions) et poussée sur le GitHub Container Registry (`ghcr.io/${GITHUB_REPOSITORY}:latest`).
  - Le serveur de production ne compile rien ; il tire simplement l'image prête à l'emploi.
- **Réseau** : Tous les conteneurs communiquent sur un réseau ponté (`internal-stack`). Seul le port `3000` est exposé, idéalement derrière un reverse proxy gérant le HTTPS.

---

## 7. Architecture et passage à grande échelle 

### 7.1 État Actuel : Environnement de Développement

Actuellement, le projet est conteneurisé pour garantir la reproductibilité et la simplicité du développement. L'ensemble des composants (Frontend, Backend, Base de données PostgreSQL, Cache Redis) est orchestré localement via **Docker** et **Docker Compose**.

Cependant cette approche est idéale pour du développement, seulement à un passage à plus grande échelle il est de rigueur de passer à de meilleur moyen. 

### 7.2 Infrastructure Haute Disponibilité à Grande Échelle

Pour absorber la charge d'un réseau social grand public et garantir une disponibilité maximale (24/7), l'infrastructure migrera vers un écosystème distribué basé sur la suite HashiCorp et des outils de clustering éprouvés.

Afin d'absorber la charge d'un réseau social tel que le notre et de garantir une autre disponibilité, l'infrastructure migrera vers l'écosystème open source distribué par HashiCorp. 

#### L'Écosystème Technologique Cible

- **HAProxy** (Proxy Inverse & Équilibrage de Charge) : Il se présentera en première ligne en distribuant le trafic entrant (les requêtes utilisateurs, les flux vers le back-end, et les différentes requêtes vers l'API Radio France). 
    
- **Nomad** (Orchestration) : En remplacement de Docker Compose, Nomad orchestrera le déploiement des conteneurs applicatifs sur un cluster de machines. Il gérera l'auto-scaling (mise à l'échelle automatique) du back et du front en fonction de l'affluence. En utilisant Nomad, nous pourrions déployer plusieurs instance du back-end avec des réplicas permettant de gérer si une instance venait à tomber lors d'un moment de forte affluence. 
    
- **Consul** (Service et connexion) : Consul servira d'annuaire dynamique. Dès qu'une nouvelle instance de notre API ou du front sera démarrée par Nomad, elle s'enregistrera auprès de Consul. HAProxy interrogera Consul afin d'avoir les adresses de chaque application leader, permettant le système de réplicas comme vu précédemment. 
    
- **Patroni & PostgreSQL (Haute Disponibilité des Données) :** Le réseau social (profils, commentaires, partages d'émissions) nécessite une base de données résiliente. Patroni orchestrera un cluster PostgreSQL (un nœud Leader en écriture, plusieurs nœuds Followers en lecture seule). En cas de panne du Leader, Patroni élira automatiquement un nouveau maître en quelques secondes sans perte de données.

---

## 8. Comment démarrer le projet (Guide de Développement)

Pour installer et exécuter l'infrastructure backend en local sur votre machine, suivez ces étapes :

### Prérequis
- **Node.js** (v18 ou supérieur recommandé)
- **Docker** & **Docker Compose** installés sur votre machine

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   cd radioMonoko-back
   npm install
   ```

2. **Configurer les variables d'environnement fourni**
   Afin de facilité les tests, nous vous fournissons un exemple de fichier d'environnement.

3. **Démarrer l'infrastructure dépendante (Base de données & Cache)**
   Montez les conteneurs PostgreSQL et Redis en arrière-plan :
   ```bash
   docker-compose -f docker-compose-dev.yml up -d
   ```

4. **Lancer le serveur en mode développement**
   Démarrez l'API :
   ```bash
   npm run dev
   ```

L'API sera alors accessible sur `http://localhost:3000` et la documentation Swagger sur `http://localhost:3000/api/docs`.

## 9. Comment tester l'API manuellement (Swagger)

Nous fournissons une interface interactive (basée sur **Swagger / OpenAPI**) permettant de tester toutes les routes de l'API directement depuis votre navigateur sans avoir besoin d'outils externes comme Postman.

### Accéder à Swagger
Une fois le serveur démarré en local (`npm run dev`), rendez-vous sur le lien suivant :
👉 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Comment l'utiliser ?
1. **Explorer les routes** : L'interface liste l'ensemble des points d'entrée (Endpoints) disponibles, regroupés par catégories (Auth, Content, Collections, Users, etc.).
2. **S'authentifier (Bouton Authorize)** : 
   - La majorité de nos routes sont protégées et nécessitent un compte.
   - Obtenez un Token JWT (en passant par les routes d'authentification ou en vous connectant via l'application).
   - Cliquez sur le bouton **Authorize** (cadenas en haut à droite) et collez votre token.
3. **Exécuter une requête** : 
   - Dépliez la route que vous souhaitez tester.
   - Cliquez sur le bouton **"Try it out"**.
   - Remplissez les paramètres requis (JSON, paramètres d'URL, etc.).
   - Cliquez sur **"Execute"** pour voir la réponse (Statut HTTP, Body de retour) de notre backend en direct.

---

## 10. Tests Automatisés et Qualité du Code

Pour garantir la fiabilité de l'application et éviter toute régression, une suite de tests automatisés est exécutée localement (idéalement avant chaque commit) et lors du processus d'intégration continue (CI).

### L'Écosystème de Test
- **Jest** : Utilisé comme framework principal de test (Test Runner et outil d'assertion) pour exécuter nos tests en TypeScript (`ts-jest`).
- **Supertest** : Permet de simuler des requêtes HTTP directement sur notre instance Express, ce qui est particulièrement puissant pour valider nos routes d'API sans démarrer de serveur réel.

### Que testons-nous ?
1. **Tests Unitaires** : Ils ciblent et isolent la logique complexe au sein de nos *Services* ou de nos fonctions utilitaires (ex: pagination, calculs).
2. **Tests d'Intégration** : Ils vérifient que les *Routes*, *Controllers* et *Middlewares* communiquent correctement. Ils permettent notamment de vérifier que la sécurité (token JWT, droits d'accès) rejette bien les requêtes non autorisées.

### Exécuter les tests localement
Pour lancer la totalité de la suite de tests (qui se trouve généralement dans `src/tests/`), exécutez simplement la commande suivante :
```bash
npm run test
```

---

## 11. Intégration de l'API Externe (Radio France)

RadioMonoko enrichit son catalogue en consommant directement les données publiques fournies par l'**Open API de Radio France**. 

### Fonctionnement Technique (GraphQL)
Contrairement à une API REST classique, l'API de Radio France est exposée via **GraphQL**. L'intégration au sein de notre backend est centralisée dans le fichier `src/config/ApiConnexion.ts`, qui agit comme un client unique :
- **Client HTTP** : La bibliothèque `Axios` est utilisée pour créer une instance configurée (`axios.create`) pointant vers le domaine de Radio France.
- **Sécurité et Authentification** : L'API externe nécessite un jeton d'accès sécurisé. Celui-ci est injecté dynamiquement dans les en-têtes HTTP (`x-token`) à partir des variables d'environnement (`RADIOFRANCE_TOKEN` et `RADIOFRANCE_ENDPOINT`).

### Le Client Centralisé (`RadioFranceClient`)
L'interaction est encapsulée dans une classe `RadioFranceClient` exportée sous la forme d'un Singleton (`radioFrance`). Elle met à disposition une méthode générique asynchrone `query()` :
1. **Préparation** : Elle prend en argument la requête GraphQL (sous forme de chaîne de caractères) et les variables associées.
2. **Exécution** : Elle déclenche l'appel réseau `POST` avec le bon formatage (`Content-Type: application/json`).
3. **Gestion d'erreurs** : Si Radio France retourne un tableau `errors` (le format standard de GraphQL pour indiquer une erreur), la méthode lève immédiatement une exception native pour stopper l'exécution et informer le Service appelant.
4. **Extraction** : En cas de succès, elle extrait et renvoie directement la donnée utile (`response.data.data`), masquant la complexité du wrapper réseau.

Grâce à cette abstraction, nos *Services* (tels que la synchronisation des émissions) peuvent invoquer l'API externe de manière transparente, sans se soucier des headers ou du traitement brut des erreurs GraphQL.
