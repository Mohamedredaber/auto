# Guide d'Implémentation - Système de Filtrage Cars

## 📌 Vue d'Ensemble

Le système de filtrage côté **Backend + Frontend** est maintenant complètement implémenté avec les changements suivants :

- **Backend** : `CarSearchService` avec filtres dynamiques + pagination
- **Frontend** : Redux Thunks, État normalisé, Composants réactifs

---

## 🏗️ Architecture

### **Backend**

```
CarListingController.index()
  ↓
CarSearchService.search(Request)
  ↓
Eloquent avec filtres dynamiques
  ↓
CarCardResource::collection() → { data: [...], meta: {...} }
```

### **Frontend**

```
FilterBar → onChange(filters)
  ↓
Cars.jsx → setFilters → useCars()
  ↓
dispatch(fetchCars(filters))
  ↓
catalogSlice → state.cars + state.pagination
  ↓
CarList + Pagination
```

---

## 🔧 Configuration des Filtres

### **Filtres Supportés** (côté Backend)

| Filtre      | Type    | Description                  | Exemple                                              |
| ----------- | ------- | ---------------------------- | ---------------------------------------------------- |
| `search`    | string  | Recherche dans brand + model | `"BMW"`                                              |
| `brand`     | string  | Marque exacte                | `"BMW"`, `"Mercedes"`                                |
| `city`      | string  | Ville (via agency)           | `"Casablanca"`, `"Marrakech"`                        |
| `fuel`      | string  | Carburant                    | `"essence"`, `"diesel"`, `"electrique"`, `"hybride"` |
| `max_price` | integer | Prix maximum par jour        | `3000`                                               |
| `sort`      | string  | Tri                          | `"price_asc"`, `"price_desc"`, `"newest"`            |
| `status`    | string  | Statut voiture               | `"available"`, `"rented"`, `"maintenance"`           |
| `page`      | integer | Numéro page (pagination)     | `1`, `2`, `3`                                        |

### **Exemple d'Appel API**

```http
GET /api/catalog?page=1&brand=BMW&city=Casablanca&fuel=diesel&max_price=3000&sort=price_asc&search=
```

**Réponse:**

```json
{
  "data": [
    {
      "id": 1,
      "brand": "BMW",
      "model": "X5",
      "price_per_day": 2500,
      "cover_image": "https://...",
      "fuel": "diesel",
      ...
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "total": 48,
    "per_page": 12
  }
}
```

---

## 📝 Fichiers Modifiés

### **Backend**

#### `backend/app/Services/Public/CarSearchService.php`

- Filtres: `brand`, `city`, `fuel`, `max_price`, `search`, `sort`, `status`
- Pagination: 12 items par page
- Logique de tri complète

### **Frontend**

#### `frontend/src/features/catalog/catalogSlice.jsx`

- `state.pagination` stocke directement `meta` de Laravel
- Meilleure gestion des cas d'erreur

#### `frontend/src/features/catalog/catalogSelectors.js`

- Nouveau sélecteur : `selectPaginationInfo()` (format transformé pour UI)
- `selectAllCars()` toujours un tableau
- `selectCatalogPagination()` retourne meta brut

#### `frontend/src/features/catalog/catalogThunks.js`

- Logs console améliorés avec structure de détection
- `fetchCars` log les métadonnées de pagination

#### `frontend/src/pages/public/cars/components/Pagination/Pagination.jsx`

- Support dual-format : `{ currentPage, lastPage }` ET `{ current_page, last_page }`
- Calcul correct du range d'affichage

#### `frontend/src/pages/public/cars/components/CarFilters/FilterBar.jsx`

- Reset complet des filtres vers les valeurs par défaut
- Maintien du comportement de debounce search

---

## 🚀 Guide de Déploiement / Test

### **Étape 1 : Backend**

```bash
# Vérifier les migrations (models Car, Agency)
cd backend
php artisan migrate:status

# (Optionnel) Seeder quelques voitures
php artisan db:seed
```

### **Étape 2 : Frontend**

```bash
cd frontend
npm install  # si nécessaire
npm run dev
```

### **Étape 3 : Test Manuel**

#### Via **FilterBar**

1. Ouvrir page `/cars`
2. Sélectionner:
   - Marque: "BMW"
   - Ville: "Casablanca"
   - Carburant: "diesel"
   - Prix max: déplacer le slider
3. Vérifier les logs console: `🚀 [fetchCars] Appel API...`

#### Via **URL** (Dev)

```bash
# Ouvrir DevTools → Network
# Filtrer par "catalog"
# Effectuer un filtre dans l'UI
# Vérifier la requête GET et sa réponse
```

#### Via **Pagination**

1. Naviguer aux pages suivantes
2. Vérifier que `page` change dans l'URL API
3. Vérifier que le compteur pagination est correct

---

## 🧪 Validation

### **Console Logs à Vérifier**

```javascript
// ✅ À voir lors d'un filtre
🚀 [fetchCars] Appel API avec params: { page: 1, brand: "BMW", ... }
📦 fetchCars: Structure PAGINÉE (data + meta) { count: 12, current_page: 1, last_page: 4, total: 48 }

// ✅ En cas d'erreur
❌ fetchCars: Erreur { message: "...", status: 500, ... }
```

### **Redux DevTools** (si installé)

Vérifier l'action `catalog/fetchCars/fulfilled`:

```json
{
  "type": "catalog/fetchCars/fulfilled",
  "payload": {
    "data": [...],
    "meta": {
      "current_page": 1,
      "last_page": 5,
      "total": 48,
      "per_page": 12
    }
  }
}
```

---

## 📊 Structure d'État Redux

```javascript
// Avant (ANCIEN)
{
  cars: [],
  pagination: { currentPage: 1, lastPage: 1, total: 0 }
}

// Après (NOUVEAU)
{
  cars: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 48,
    per_page: 12
  }
}
```

---

## 🐛 Troubleshooting

| Problème                     | Solution                                                        |
| ---------------------------- | --------------------------------------------------------------- |
| API retourne 0 résultats     | Vérifier `status = 'available'` au backend                      |
| Pagination ne fonctionne pas | Vérifier que `per_page = 12` dans la réponse                    |
| Filtres ne s'appliquent pas  | Vérifier les logs d'API, les params en URL                      |
| Reset ne vide pas les champs | Vérifier que FilterBar appelle `onChange` avec tous les filtres |

---

## 🎯 Prochaines Étapes (Optionnel)

1. **Agrégation de filtres** : Ajouter un résumé des filtres actifs
2. **Save Filters** : Sauvegarder les filtres dans localStorage
3. **Export Results** : Exporter les résultats en CSV/PDF
4. **Advanced Search** : Ajuster les filtres avancés (transmission, seats, etc.)

---

## 📞 Support

Pour toute question sur l'implémentation, consulter :

- `/memories/session/filtrage_implementation.md`
- `backend/app/Services/Public/CarSearchService.php`
- `frontend/src/hooks/useCars.jsx`
