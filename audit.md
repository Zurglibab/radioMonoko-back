# Audit technique du backend SUPCONTENT

**Périmètre audité :** uniquement le dépôt backend `radioMonoko-back`.  
**Important :** l’utilisateur a précisé qu’il n’y a ni client web, ni client mobile, ni documentation dans ce repo ; ces éléments ne sont donc **pas comptabilisés comme des manques bloquants du dépôt backend** dans cette version de l’audit.

---

## Verdict rapide

Le backend présente une base réelle et structurée : couches `routes / controllers / services / DAO / repository`, OpenAPI, JWT, OAuth Google, Redis, PostgreSQL, tests d’intégration.  
En revanche, plusieurs points critiques restent à corriger avant une mise en qualité sérieuse : **secrets sensibles**, **fallback JWT dangereux**, **CORS trop permissif**, **routes de relations utilisateur incohérents**, **initialisation DB destructive**, et **autorisation insuffisante sur plusieurs ressources métier**.

**Conclusion backend-only : structure intéressante, mais sécurité et robustesse insuffisantes pour considérer le backend comme prêt.**

---

## Note globale provisoire backend-only

> **11,5 / 20**  
> Équivalent indicatif : **≈ 288 / 500** si l’on extrapole au barème global, mais cette conversion reste approximative car le dépôt ne contient que le backend.

Répartition indicative backend-only :

| Axe | Note | Commentaire |
|---|---:|---|
| Qualité de code | **3,2 / 5** | Architecture lisible, mais incohérences de paramètres, duplication et validations trop légères. |
| Sécurité | **2,0 / 5** | JWT de secours, CORS ouvert, autorisations trop faibles, secrets exposés en local. |
| Fonctionnalités backend | **3,0 / 5** | Plusieurs briques utiles sont présentes, mais de nombreuses fonctions restent partielles ou fragiles. |
| Architecture / déploiement backend | **1,3 / 5** | Docker présent, mais dépendance GHCR, bootstrap fragile et init DB destructive. |

---

## Points positifs

- Séparation globale des responsabilités : routes, contrôleurs, services, DAO, repository.
- Utilisation de TypeScript.
- Requêtes SQL paramétrées dans plusieurs DAO.
- JWT et hashage des mots de passe avec `bcryptjs`.
- OAuth Google implémenté partiellement.
- Redis utilisé comme cache des données externes.
- Documentation OpenAPI présente dans le code.
- Présence de tests d’intégration sur plusieurs flux.

Ces éléments montrent une base de travail sérieuse pour un backend applicatif, même si l’ensemble reste inégal.

---

## Constats à maintenir dans l’audit

### 1) Routes et contrôleurs de relations utilisateur incohérents
Le module `userRelation` présente un problème important de cohérence entre les routes et les contrôleurs.

Exemples observés :
- `src/routes/userRelationRoutes.ts` utilise des chemins comme `/:id`, `/:id`, `/:id` selon les endpoints
- `src/controllers/userRelation.controller.ts` lit des paramètres différents : `followedId`, `requesterId`, `blockedId`, `userId`

**Impact :** plusieurs endpoints risquent de ne pas fonctionner correctement ou de recevoir un paramètre `undefined`.

---

### 2) Initialisation de base de données dangereuse
Dans `src/database/db.ts`, l’initialisation exécute :
- `DROP TABLE IF EXISTS user_relations;`

**Impact :** comportement destructif au démarrage, perte potentielle de données et absence de sécurité d’exploitation.

---

### 3) Secrets et valeurs de secours trop risqués
Constats majeurs :
- présence de secrets dans le fichier `.env` du workspace (JWT, PostgreSQL, Google OAuth)
- fallback JWT `"changeme"` dans `src/routes/authRoutes.ts`
- `src/config/ApiConnexion.ts` échoue dès l’import si le token externe manque

**Impact :** niveau de sécurité insuffisant pour un dépôt destiné à être partagé ou déployé tel quel.

---

### 4) CORS trop permissif
Dans `src/app.ts` :
- `Access-Control-Allow-Origin: *`
- headers et méthodes très larges

**Impact :** acceptable en développement, mais trop ouvert pour une exposition contrôlée.

---

### 5) Autorisations trop faibles sur plusieurs ressources
Plusieurs routes métier exposent des opérations sensibles sans vérification fine de propriété :
- collections
- collection items
- reviews
- likes/dislikes
- notifications
- notation de contenu

Dans plusieurs cas, le backend accepte des identifiants fournis par le client au lieu de s’appuyer strictement sur l’identité issue du token.

**Impact :** risque d’usurpation et de modification de données d’autrui.

---

## Analyse par axe backend

## 1. Qualité de code

### Points positifs
- architecture en couches claire
- typage présent
- services séparés des DAO
- logs et erreurs globalement gérés

### Faiblesses

#### a) Validation trop légère
- les DTO existent, mais la validation reste surtout manuelle et dispersée
- beaucoup de contrôleurs passent directement `req.body` aux services

#### b) Duplication et cohérence imparfaite
- plusieurs routes instancient directement les dépendances
- plusieurs fichiers portent des responsabilités proches sans abstraction commune
- `console.log` encore présent dans plusieurs modules au lieu d’un logging homogène

#### c) Nommage et lisibilité
- incohérences de vocabulaire entre `show`, `diffusion`, `live`, `content`, `brands`
- dossier `scedulers` mal orthographié
- certains DTO/DAO portent des noms peu homogènes

#### d) Logique métier partiellement dispersée
- certaines règles de contrôle sont faites dans les contrôleurs, d’autres dans les services, parfois avec des comportements différents

### Note qualité de code
**3,2 / 5**

---

## 2. Sécurité

### Points positifs
- hashage des mots de passe
- vérification du token JWT dans le middleware d’authentification
- contrôle du statut `is_banned` sur certains flux
- requêtes SQL généralement paramétrées

### Problèmes critiques

#### a) Fallback JWT dangereux
Le secret JWT de secours `"changeme"` est un vrai point faible.

#### b) CORS permissif
Le backend est ouvert à toutes les origines.

#### c) Secret management insuffisant
Le dépôt contient, dans le contexte local observé, des secrets en clair.

#### d) Autorisation trop faible
Plusieurs endpoints acceptent des données sensibles sans imposer systématiquement un contrôle d’appartenance.

#### e) Absence de mécanisme de révocation
Je ne vois pas de déconnexion sécurisée ni de gestion de révocation de token.

### Note sécurité
**2,0 / 5**

---

## 3. Fonctionnalités backend par rapport au cahier des charges

> Ici, je n’évalue que ce qui est visible côté backend.

### Présent, au moins partiellement
- inscription / connexion avec email et mot de passe
- OAuth Google
- profil utilisateur public / privé
- follow / unfollow / accept / refuse / block
- feed d’activité
- collections
- contenus externes enrichis par API tierce
- reviews
- likes/dislikes sur review
- notifications
- signalement d’utilisateur
- cache Redis
- documentation OpenAPI

### Partiel ou fragile

#### a) Authentification
- inscription et login présents
- OAuth Google fonctionne en partie
- pas de vraie stratégie complète de cycle de vie de session/token

#### b) Collections
- `collections` existent
- le flag public/privé existe
- en revanche, on ne voit pas les statuts métier du cahier des charges (`À voir`, `En cours`, `Terminé`, `Abandonné`)
- pas de statistique de collection visible

#### c) Reviews / notes
- les critiques existent
- le système de notation est séparé et reste incomplet dans la logique métier globale
- la propriété des contenus / critiques n’est pas verrouillée partout

#### d) Social
- le follow et le feed existent
- mais la fiabilité dépend d’un module `userRelation` qui semble incohérent au niveau des paramètres
- pas de messagerie privée

#### e) Notifications
- lecture / marquage lu / filtrage non lues présents
- pas de temps réel visible (WebSocket / SSE / polling structuré)

#### f) Recherche avancée
- recherche utilisateurs présente
- recherche API externe présente sous une forme simple
- pas de recherche unifiée complète ni de filtres avancés clairement visibles

#### g) Modération
- bannissement utilisateur
- signalement
- mise en avant de review
- mais protection administrative encore incomplète dans l’ensemble

### Note fonctionnalités backend
**3,0 / 5**

---

## 4. Architecture et déploiement backend

### Points positifs
- Dockerfile multi-stage propre
- PostgreSQL et Redis présents dans le stack
- CI GitHub Actions pour build/push d’image
- séparation d’environnements dev / prod

### Faiblesses

#### a) `docker-compose.yml` dépend d’une image distante
Le service `api` pointe vers `ghcr.io/${GITHUB_REPOSITORY}:latest`.

**Impact :** le backend n’est pas totalement autonome si l’image n’est pas publiée ou accessible.

#### b) `docker-compose-dev.yml` incomplet
Le compose de développement ne lance pas l’API.

#### c) Démarrage fragile
- `initializeDatabase()` au boot
- `ApiConnexion.ts` dépend d’un token API externe dès l’import

#### d) Initialisation destructrice
Le `DROP TABLE IF EXISTS user_relations` reste un point majeur.

### Note architecture / déploiement
**1,3 / 5**

---

## Ce que je retirerais de la version précédente

- Je ne considère plus l’absence de client web/mobile comme une non-conformité du dépôt backend, puisque tu as précisé que ce repo est uniquement le backend.
- Je ne considère plus l’absence de documentation comme un critère bloquant du dépôt backend seul.
- En revanche, les défauts de sécurité, de cohérence et de robustesse restent entièrement valides.

---

## Conclusion

Le backend `radioMonoko-back` est **réellement structuré** et contient une partie significative des fonctionnalités attendues, mais il souffre encore de plusieurs faiblesses importantes :
- cohérence des routes de relations utilisateur
- gestion des secrets
- sécurité des accès
- bootstrap de base de données trop agressif
- déploiement backend pas totalement autonome

**Bilan backend-only : prometteur, mais pas encore robuste ni suffisamment sécurisé.**
