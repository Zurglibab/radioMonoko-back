# 📺 RadioMonoko Shows API Documentation

## Base URL
```
http://localhost:3000/api/shows
```

## Stations disponibles
```
FRANCEINTER
FRANCECULTURE
FRANCEMUSIQUEOCORA
MOUV
FRANCEBLEU
CLASSIQUE
LELAB
```

## Endpoints disponibles

### 📚 Récupérer tous les shows d'une station
```
GET /api/shows/:station
```
**Description :** Récupère la liste complète des shows pour une station. Utilise Redis en priorité, fallback sur l'API Radio France si vide.

**Parameters :**
- `station` (string, required, path) : La station (`FRANCEINTER`, `FRANCECULTURE`, etc.)
- `first` (number, optional, query) : Nombre de shows à récupérer (défaut: 10)

**Example :**
```
GET /api/shows/FRANCEINTER?first=5
```

**Response (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "0057e73d-c33a-4eca-81c6-9867a94b4ae8_1",
      "title": "Des vies franaises",
      "diffusions": [
        {
          "title": "Titre de la diffusion",
          "url": "https://...",
          "personalities": [
            {
              "id": "personality-id",
              "name": "John Doe"
            }
          ]
        }
      ],
      "taxonomies": [
        {
          "id": "taxonomy-id",
          "path": "/...",
          "type": "genre",
          "title": "Histoire",
          "standFirst": "Description courte"
        }
      ]
    },
    ...
  ],
  "count": 5,
  "station": "FRANCEINTER"
}
```

**Response (400 Bad Request) - Invalid station :**
```json
{
  "success": false,
  "error": "Invalid station. Valid stations: FRANCEINTER, FRANCECULTURE, ..."
}
```

---

### 🎯 Récupérer un show spécifique par ID
```
GET /api/shows/:station/:id
```
**Description :** Récupère un show spécifique par son ID pour une station donnée.

**Parameters :**
- `station` (string, required, path) : La station
- `id` (string, required, path) : L'ID du show

**Example :**
```
GET /api/shows/FRANCEINTER/0057e73d-c33a-4eca-81c6-9867a94b4ae8_1
```

**Response (200 OK) :**
```json
{
  "success": true,
  "data": {
    "id": "0057e73d-c33a-4eca-81c6-9867a94b4ae8_1",
    "title": "Des vies franaises",
    "diffusions": [...],
    "taxonomies": [...]
  }
}
```

**Response (404 Not Found) :**
```json
{
  "success": false,
  "error": "Show with id \"0057e73d-c33a-4eca-81c6-9867a94b4ae8_1\" not found for station \"FRANCEINTER\""
}
```

---

### 🔍 Rechercher des shows par titre
```
GET /api/shows/:station/search/:title
```
**Description :** Recherche les shows par titre (recherche partielle, insensible à la casse).

**Parameters :**
- `station` (string, required, path) : La station
- `title` (string, required, path) : Mot-clé de recherche

**Example :**
```
GET /api/shows/FRANCEINTER/search/histoire
```

**Response (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Histoires de vie",
      ...
    }
  ],
  "count": 3,
  "query": "histoire",
  "station": "FRANCEINTER"
}
```

---

### 🔄 Rafraîchir les shows d'une station
```
POST /api/shows/:station/refresh
```
**Description :** Force un rafraîchissement des shows depuis l'API Radio France vers Redis pour une station.

**Parameters :**
- `station` (string, required, path) : La station
- `first` (number, optional, query) : Nombre de shows à récupérer (défaut: 10)

**Example :**
```
POST /api/shows/FRANCEINTER/refresh?first=15
```

**Response (200 OK) :**
```json
{
  "success": true,
  "message": "Successfully refreshed 5 shows for station FRANCEINTER",
  "data": [...],
  "count": 5,
  "station": "FRANCEINTER",
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

---

### 📊 Compter les shows d'une station
```
GET /api/shows/:station/stats/count
```
**Description :** Récupère le nombre total de shows en cache pour une station.

**Parameters :**
- `station` (string, required, path) : La station

**Example :**
```
GET /api/shows/FRANCEINTER/stats/count
```

**Response (200 OK) :**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "station": "FRANCEINTER"
  },
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

---

### 🗑️ Vider le cache des shows
```
DELETE /api/shows/:station/cache
```
**Description :** Supprime tous les shows du cache Redis pour une station.

**Parameters :**
- `station` (string, required, path) : La station

**Example :**
```
DELETE /api/shows/FRANCEINTER/cache
```

**Response (200 OK) :**
```json
{
  "success": true,
  "message": "Shows cache cleared for station FRANCEINTER",
  "station": "FRANCEINTER",
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

---

## 🧪 Exemples d'utilisation

### Récupérer les shows avec JavaScript
```javascript
async function getShowsByStation(station) {
  const response = await fetch(`http://localhost:3000/api/shows/${station}?first=5`);
  const result = await response.json();
  
  if (result.success) {
    console.log(`Shows for ${station}: ${result.count}`);
    result.data.forEach(show => {
      console.log(`- ${show.title}`);
    });
  }
}

getShowsByStation("FRANCEINTER");
```

### Chercher un show
```javascript
async function searchShowsByTitle(station, query) {
  const response = await fetch(
    `http://localhost:3000/api/shows/${station}/search/${query}`
  );
  const result = await response.json();
  
  if (result.success) {
    console.log(`Results for "${query}": ${result.count}`);
    result.data.forEach(show => {
      console.log(`- ${show.title}`);
    });
  }
}

searchShowsByTitle("FRANCEINTER", "histoire");
```

### Rafraîchir le cache
```javascript
async function refreshShowsCache(station) {
  const response = await fetch(
    `http://localhost:3000/api/shows/${station}/refresh`,
    { method: "POST" }
  );
  const result = await response.json();
  console.log(result.message);
}

refreshShowsCache("FRANCEINTER");
```

---

## ⚠️ Gestion des erreurs

Tous les endpoints retournent :
- `success: true` si la requête a réussi
- `success: false` avec un message d'erreur sinon

**Codes de statut HTTP :**
- `200 OK` : Succès
- `400 Bad Request` : Station invalide
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur
- `503 Service Unavailable` : Problème de connexion Redis

---

## 📝 Notes

1. Les shows sont cachés par **station** dans Redis (keys: `shows:FRANCEINTER`, etc.)
2. Les réponses utilisent **Redis en cache** pour des performances optimales.
3. Si Redis est vide, l'API fait un **fallback sur l'API Radio France**.
4. Toutes les réponses incluent un **timestamp ISO**.
5. Le paramètre `first` contrôle le nombre de shows retournés par l'API.


