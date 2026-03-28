# 📡 RadioMonoko Backend - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints disponibles

### 🏥 Health Check
```
GET /api/health
```
**Description :** Vérifie l'état de santé de l'API et la connexion Redis.

**Response (200 OK) :**
```json
{
  "success": true,
  "status": "healthy",
  "redis": {
    "connected": true,
    "brands_cached": 42
  },
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

---

### 📚 Récupérer toutes les brands
```
GET /api/brands
```
**Description :** Récupère la liste complète des brands. Utilise Redis en priorité, fallback sur l'API Radio France si vide.

**Response (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "brand-1",
      "title": "France Inter",
      "baseline": "La radio généraliste",
      "description": "La première radio généraliste...",
      "websiteUrl": "https://...",
      "liveStream": "https://...",
      "playerUrl": "https://...",
      "webRadios": [],
      "localRadios": [...]
    },
    ...
  ],
  "count": 42
}
```

**Query Parameters :** Aucun

---

### 🎯 Récupérer une brand par ID
```
GET /api/brands/:id
```
**Description :** Récupère une brand spécifique par son ID.

**Parameters :**
- `id` (string, required) : L'ID de la brand

**Example :**
```
GET /api/brands/france-inter
```

**Response (200 OK) :**
```json
{
  "success": true,
  "data": {
    "id": "france-inter",
    "title": "France Inter",
    ...
  }
}
```

**Response (404 Not Found) :**
```json
{
  "success": false,
  "error": "Brand with id \"france-inter\" not found"
}
```

---

### 🔍 Rechercher des brands
```
GET /api/brands/search/:title
```
**Description :** Recherche les brands par titre (recherche partielle, insensible à la casse).

**Parameters :**
- `title` (string, required) : Mot-clé de recherche

**Example :**
```
GET /api/brands/search/france
```

**Response (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "france-inter",
      "title": "France Inter",
      ...
    },
    {
      "id": "france-culture",
      "title": "France Culture",
      ...
    }
  ],
  "count": 2,
  "query": "france"
}
```

---

### 🔄 Rafraîchir le cache
```
POST /api/brands/refresh
```
**Description :** Force un rafraîchissement des brands depuis l'API Radio France vers Redis.

**Body :** Aucun

**Example :**
```bash
curl -X POST http://localhost:3000/api/brands/refresh
```

**Response (200 OK) :**
```json
{
  "success": true,
  "message": "Successfully refreshed 42 brands",
  "data": [...],
  "count": 42,
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

---

### 📊 Compter les brands
```
GET /api/brands/stats/count
```
**Description :** Récupère le nombre total de brands en cache.

**Response (200 OK) :**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "timestamp": "2024-03-21T10:30:00.000Z"
  }
}
```

---

### 🗑️ Vider le cache
```
DELETE /api/brands/cache
```
**Description :** Supprime toutes les brands du cache Redis.

**Body :** Aucun

**Example :**
```bash
curl -X DELETE http://localhost:3000/api/brands/cache
```

**Response (200 OK) :**
```json
{
  "success": true,
  "message": "Brands cache cleared successfully",
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

---

## 🔧 Configuration

### Variables d'environnement

```bash
# Port du serveur
PORT=3000

# Redis
REDIS_URL=redis://localhost:6379

# API Radio France
RADIOFRANCE_TOKEN=your_token_here
RADIOFRANCE_ENDPOINT=https://api.radiofrance.fr/graphql

# Scheduler (optionnel)
BRANDS_REFRESH_CRON="0 0,12 * * *"      # 00h et 12h tous les jours
BRANDS_REFRESH_TZ="Europe/Paris"
```

---

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

---

## ✅ Exemples d'utilisation (Frontend)

### Récupérer toutes les brands (React)
```javascript
async function getAllBrands() {
  const response = await fetch("http://localhost:3000/api/brands");
  const result = await response.json();
  
  if (result.success) {
    console.log(`Brands: ${result.count}`);
    console.log(result.data);
  }
}
```

### Rechercher une brand (JavaScript)
```javascript
async function searchBrands(query) {
  const response = await fetch(`http://localhost:3000/api/brands/search/${query}`);
  const result = await response.json();
  
  if (result.success) {
    console.log(`Résultats pour "${query}": ${result.count}`);
    result.data.forEach(brand => {
      console.log(`- ${brand.title}`);
    });
  }
}

searchBrands("france");
```

### Récupérer une brand spécifique
```javascript
async function getBrandDetails(brandId) {
  const response = await fetch(`http://localhost:3000/api/brands/${brandId}`);
  const result = await response.json();
  
  if (result.success) {
    console.log(result.data);
  } else {
    console.log("Brand not found");
  }
}
```

### Rafraîchir le cache
```javascript
async function refreshCache() {
  const response = await fetch("http://localhost:3000/api/brands/refresh", {
    method: "POST"
  });
  const result = await response.json();
  
  console.log(result.message);
}
```

---

## ⚠️ Gestion des erreurs

Tous les endpoints retournent :
- `success: true` si la requête a réussi
- `success: false` avec un message d'erreur sinon

**Codes de statut HTTP :**
- `200 OK` : Succès
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur
- `503 Service Unavailable` : Problème de connexion Redis

---

## 📝 Notes

1. Le **scheduler automatique** rafraîchit les brands à **00h et 12h** (fuseau `Europe/Paris`).
2. Les réponses utilisent **Redis en cache** pour des performances optimales.
3. Si Redis est vide, l'API fait un **fallback sur l'API Radio France**.
4. Toutes les réponses incluent un **timestamp ISO**.


