# 🎉 RadioMonoko - Architecture Complète (Brands + Shows)

## ✅ Architecture mise en place

Tu as maintenant une architecture **complète** avec **Brands** et **Shows** :

```
source/
├── Interfaces/
│   └── showInterface.ts         # Types Show/Diffusion/Taxonomy
├── Entities/
├── DTO/
│   ├── brandDTO.ts
│   └── showDTO.ts               # DTO Shows + mapper toShowDto
├── Repository/
│   ├── apiRepository.ts         # Brands API
│   └── showRepository.ts     # Shows API
├── DAO/
│   ├── brandDAO.ts              # Brands Redis
│   └── showDAO.ts          # Shows Redis (par station)
├── Services/
│   ├── apiServices.ts           # Brands Service
│   └── showServices.ts          # Shows Service
├── Controllers/
│   ├── brandController.ts         # Brands endpoints
│   └── showController.ts        # Shows endpoints
├── Routes/
│   ├── apiRoutes.ts             # Routing principal
│   └── showRoutes.ts            # Routes shows
├── Schedulers/
│   └── brandsScheduler.ts       # Cron brands (00h/12h)
└── tests/
    ├── integrationTest.ts       # Test Brands API → Redis
    └── showsIntegrationTest.ts  # Test Shows API → Redis

index.ts                          # Entrée principale
source/app.ts                     # Express + routes
```

---

## 📡 7 Endpoints Brands + 6 Endpoints Shows

### **Brands** (7 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/brands` | Récupère toutes les brands |
| `GET` | `/api/brands/:id` | Récupère une brand |
| `GET` | `/api/brands/search/:title` | Cherche des brands |
| `POST` | `/api/brands/refresh` | Force refresh API → Redis |
| `GET` | `/api/brands/stats/count` | Compte les brands |
| `DELETE` | `/api/brands/cache` | Vide cache Redis |
| `GET` | `/api/health` | Health check |

### **Shows** (6 endpoints)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/shows/:station` | Récupère shows d'une station |
| `GET` | `/api/shows/:station/:id` | Récupère un show |
| `GET` | `/api/shows/:station/search/:title` | Cherche dans une station |
| `POST` | `/api/shows/:station/refresh` | Force refresh API → Redis |
| `GET` | `/api/shows/:station/stats/count` | Compte shows |
| `DELETE` | `/api/shows/:station/cache` | Vide cache d'une station |

---

## 🚀 Démarrer l'API complète

```powershell
npm run dev
```

Serveur sur `http://localhost:3000` avec :
- ✅ Tous les endpoints Brands + Shows
- ✅ Scheduler cron (00h/12h pour brands)
- ✅ Cache Redis intelligent
- ✅ Fallback API quand cache vide
- ✅ CORS activé

---

## 🧪 Tests disponibles

### Test Brands complet
```powershell
npx tsx source/tests/integrationTest.ts
```
→ Récupère 42 brands depuis l'API, les stocke dans Redis, les vérifie

### Test Shows complet
```powershell
npx tsx source/tests/showsIntegrationTest.ts
```
→ Récupère 5 shows depuis l'API, les stocke dans Redis, les vérifie

### Test routes Express
```powershell
npx tsx source/tests/apiRoutesTest.ts
```
→ Vérifie que l'app Express est bien configurée

---

## 📊 Comparaison Brands vs Shows

| Aspect | Brands | Shows |
|--------|--------|-------|
| **Cache par** | Global | Station |
| **Query param** | Aucun | `?first=` |
| **Identifiant** | UUID simple | UUID + station |
| **Redis keys** | `brands:all`, `brand:id` | `shows:STATION`, `show:STATION:id` |
| **Stations** | N/A | `FRANCEINTER`, `FRANCECULTURE`, etc. |
| **Refresh auto** | Oui (00h/12h) | Non (manuel) |
| **Endpoints** | 7 | 6 |

---

## 📚 Documentation complète

- **Brands** : `API_DOCUMENTATION.md`
- **Shows** : `SHOWS_API_DOCUMENTATION.md`
- **Setup** : `SETUP.md`

---

## 🧬 Pattern architecture pour chaque ressource

### 1. **Interfaces** (types API externe)
```
src/Interfaces/showInterface.ts
```

### 2. **DTO** (types d'échange)
```
src/DTO/showDTO.ts
- ShowDto
- toShowDto() mapper
```

### 3. **Repository** (accès API)
```
src/Repository/showRepository.ts
- fetchShowsByStation()
```

### 4. **DAO** (accès Redis)
```
src/DAO/showDAO.ts
- saveAllByStation()
- getAllByStation()
- getByIdAndStation()
- deleteByIdAndStation()
- countByStation()
```

### 5. **Service** (logique métier)
```
src/Services/showServices.ts
- refreshShowsFromApiToRedis()
- getShowsFromRedis()
- getShowsWithFallback()
- deleteShowsFromRedis()
```

### 6. **Controller** (endpoints REST)
```
src/controllers/showController.ts
- getShowsByStation()
- getShowById()
- searchShowsByTitle()
- refreshShows()
- getShowsCount()
- clearShowsCache()
```

### 7. **Routes** (routing)
```
src/routes/showRoutes.ts
- GET /shows/:station
- POST /shows/:station/refresh
- etc.
```

---

## 💡 Points clés

✅ **Clean Architecture** : Entity, DTO, DAO, Service, Repository, Controller
✅ **Cache intelligent** : Redis prioritaire, fallback API
✅ **Par station** : Shows séparé par station (contrairement aux Brands globales)
✅ **CRUD complet** : Create/Read/Update/Delete pour chaque ressource
✅ **Tests intégrés** : Tests complets API → Redis pour chaque ressource
✅ **Documentation** : Endpoints documentés pour Brands et Shows
✅ **Logging** : Prefixes `[moduleName]` pour tracer chaque opération

---

## 🔌 Intégration Frontend

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

function Shows() {
  const [shows, setShows] = useState([]);
  const station = "FRANCEINTER";

  useEffect(() => {
    fetch(`http://localhost:3000/api/shows/${station}?first=10`)
      .then(res => res.json())
      .then(data => setShows(data.data));
  }, []);

  return (
    <ul>
      {shows.map(show => (
        <li key={show.id}>{show.title}</li>
      ))}
    </ul>
  );
}
```

---

## 📞 Troubleshooting

### Erreur : "Redis connection failed"
```powershell
redis-cli ping
# Doit retourner "PONG"
```

### Shows retournent 0 résultats
1. Vérifier que `RADIOFRANCE_TOKEN` est correct
2. Vérifier la station est valide
3. Lancer un refresh manuel : `POST /api/shows/FRANCEINTER/refresh`

### API_DOCUMENTATION.md vs SHOWS_API_DOCUMENTATION.md
- **API_DOCUMENTATION.md** : Pour Brands uniquement
- **SHOWS_API_DOCUMENTATION.md** : Pour Shows par station

---

## 🎯 Next steps recommandés

1. ✅ Lancer `npm run dev` et tester les 13 endpoints
2. ✅ Vérifier Redis avec `GET /api/health`
3. ✅ Chercher des brands/shows avec `/search`
4. ✅ Rafraîchir le cache manuellement
5. ✅ Intégrer dans ton frontend (React, Vue, etc.)
6. ✅ (Optionnel) Ajouter scheduler pour shows aussi

---

**Ton backend est 100% prêt pour le frontend ! 🚀**


