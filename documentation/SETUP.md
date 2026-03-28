# 🎉 RadioMonoko Backend - Setup Complet

## ✅ Architecture mise en place

Tu as maintenant une architecture **professionnelle** et **modulaire** :

```
source/
├── app.ts                    # Express app + routes + middleware
├── controllers/
│   └── brandController.ts      # Contrôleurs REST (7 endpoints)
├── routes/
│   └── apiRoutes.ts          # Configuration des routes
├── Services/
│   └── brandsServices.ts        # Logique métier (refresh, get, fallback)
├── Repository/
│   └── brandsRepository.ts      # Accès API Radio France
├── DAO/
│   └── brandDAO.ts           # Accès Redis (CRUD complet)
├── Config/
│   ├── ApiConnexion.ts       # Client GraphQL Radio France
│   └── RedisConnexion.ts     # Client Redis
├── DTO/
│   └── brandDTO.ts           # Types d'échange (données)
├── Schedulers/
│   └── brandsScheduler.ts    # Cron auto (00h/12h)
├── Entities/
│   └── BrandEntity.ts        # Modèle métier
└── tests/
    ├── integrationTest.ts    # Test API → Redis complet
    ├── apiRoutesTest.ts      # Test routes Express
    └── apiTests.ts           # Test repository

index.ts                       # Entrée principale (Express + Scheduler)
```

## 🚀 Commandes de démarrage

### 1️⃣ Mode développement (avec tsx)
```powershell
npm run dev
```
Lance le serveur sur `http://localhost:3000` avec le scheduler cron qui rafraîchit à **00h** et **12h** (fuseau `Europe/Paris`).

### 2️⃣ Mode production
```powershell
npm run build
npm start
```

### 3️⃣ Tester les endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Récupérer toutes les brands
curl http://localhost:3000/api/brands

# Chercher une brand
curl http://localhost:3000/api/brands/search/france

# Rafraîchir le cache
curl -X POST http://localhost:3000/api/brands/refresh

# Compter les brands
curl http://localhost:3000/api/brands/stats/count

# Vider le cache
curl -X DELETE http://localhost:3000/api/brands/cache
```

## 📚 7 Endpoints disponibles pour ton Frontend

### GET /api/health
Vérifie l'état de l'API et Redis.

**Response :**
```json
{
  "success": true,
  "status": "healthy",
  "redis": {
    "connected": true,
    "brands_cached": 42
  }
}
```

---

### GET /api/brands
Récupère **toutes les brands** (Redis d'abord, fallback API).

**Response :**
```json
{
  "success": true,
  "data": [ { "id": "...", "title": "...", ... } ],
  "count": 42
}
```

---

### GET /api/brands/:id
Récupère **une brand par ID**.

**Example :** `GET /api/brands/france-inter`

---

### GET /api/brands/search/:title
**Cherche** les brands par titre (partiel, case-insensitive).

**Example :** `GET /api/brands/search/france` → retourne toutes les brands contenant "france"

---

### POST /api/brands/refresh
**Force** un rafraîchissement depuis l'API Radio France vers Redis.

**Response :**
```json
{
  "success": true,
  "message": "Successfully refreshed 42 brands",
  "data": [ ... ],
  "count": 42
}
```

---

### GET /api/brands/stats/count
Récupère le **nombre total** de brands en cache.

**Response :**
```json
{
  "success": true,
  "data": {
    "total": 42
  }
}
```

---

### DELETE /api/brands/cache
**Vide** complètement le cache Redis.

---

## 🧪 Tests disponibles

### Test complet (API → Redis)
```powershell
npx tsx source/tests/integrationTest.ts
```
Teste le cycle complet : fetch API → store Redis → retrieve → verify.

### Test des routes
```powershell
npx tsx source/tests/apiRoutesTest.ts
```
Vérifie que l'app Express est bien configurée.

### Test du repository seul
```powershell
npx tsx source/tests/apiTests.ts
```
Teste juste le repository d'API.

## ⚙️ Configuration (.env)

```bash
# Port
PORT=3000

# Redis
REDIS_URL=redis://localhost:6379

# API Radio France
RADIOFRANCE_TOKEN=your_token_here
RADIOFRANCE_ENDPOINT=https://api.radiofrance.fr/graphql

# Scheduler (optionnel - override les valeurs par défaut)
BRANDS_REFRESH_CRON="0 0,12 * * *"      # 00h et 12h tous les jours
BRANDS_REFRESH_TZ="Europe/Paris"
```

## 🔄 Scheduler cron

**Par défaut :** Rafraîchit les brands à **00h** et **12h** en fuseau `Europe/Paris`.

**Pour tester manuellement** (chaque 2 minutes) :
```powershell
$env:BRANDS_REFRESH_CRON="*/2 * * * *"
npm run dev
```

**Format cron :** `minute heure jour mois jourSemaine`
- `*/2 * * * *` = toutes les 2 minutes
- `0 14 * * *` = 14h00 tous les jours
- `0 0,12 * * *` = 00h et 12h tous les jours (défaut)

## 📱 Utilisation côté Frontend

### React
```jsx
import { useState, useEffect } from "react";

function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/brands")
      .then(res => res.json())
      .then(data => setBrands(data.data));
  }, []);

  return (
    <ul>
      {brands.map(brand => (
        <li key={brand.id}>{brand.title}</li>
      ))}
    </ul>
  );
}
```

### Vue.js
```javascript
async function loadBrands() {
  const response = await fetch("http://localhost:3000/api/brands");
  const result = await response.json();
  this.brands = result.data;
}
```

### Vanilla JavaScript
```javascript
const brands = await fetch("http://localhost:3000/api/brands")
  .then(res => res.json())
  .then(data => data.data);
```

## ✨ Points clés

✅ **Clean Architecture** : Entity, DTO, DAO, Service, Repository
✅ **Cache intelligent** : Redis en priorité, fallback API
✅ **Scheduler automatique** : Rafraîchit 2x par jour (00h/12h)
✅ **API REST** : 7 endpoints avec CORS activé
✅ **Logging** : Prefixes `[moduleName]` pour tracer les opérations
✅ **Gestion d'erreurs** : Try/catch + messages clairs
✅ **Tests** : Integration, routes, repository

## 🎯 Next steps recommandés

1. ✅ Lancer `npm run dev` et tester les endpoints
2. ✅ Vérifier Redis avec `http://localhost:3000/api/health`
3. ✅ Chercher des brands avec `/api/brands/search/:title`
4. ✅ Intégrer les endpoints dans ton frontend
5. ✅ Personnaliser le scheduler si besoin (cron, timezone)

## 🆘 Troubleshooting

### Erreur : "Cannot find module 'redis'"
```powershell
npm install
```

### Erreur : "Redis connection failed"
Vérifier que Redis est lancé :
```powershell
# Vérifier que Redis tourne sur le port 6379
redis-cli ping
# Doit retourner "PONG"
```

### Les brands ne s'affichent pas
1. Vérifier que `RADIOFRANCE_TOKEN` est correct dans `.env`
2. Lancer un refresh manuel : `POST /api/brands/refresh`
3. Vérifier l'état : `GET /api/health`

---

**Enjoy! 🎉 Ton API est prête pour le frontend !**


