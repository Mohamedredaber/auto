# 🧪 Guide de Test - Système de Filtrage Cars

## 🎯 Objectif

Valider que le système de filtrage fonctionne correctement à tous les niveaux (Backend ↔ Frontend).

---

## 🔧 Prérequis

- [ ] Backend lancé (`php artisan serve`)
- [ ] Frontend lancé (`npm run dev`)
- [ ] DevTools ouverts (F12)
- [ ] Console active
- [ ] Onglet Network activé

---

## 📋 Checklist de Test

### **Test 1: Filtrage par Marque**

#### Frontend

1. Aller sur `/cars`
2. SelectionnerMarque → "BMW"
3. Observer:
   - ✅ Console: `🚀 [fetchCars]` apparait
   - ✅ Network: requête GET `/api/catalog?brand=BMW&page=1`
   - ✅ UI: Affiche uniquement les BMW

#### Backend

```bash
curl "http://localhost:8000/api/catalog?brand=BMW&page=1"
# Vérifier que `where('brand', 'BMW')` est appliqué
```

**Résultat attendu:**

```json
{
  "data": [
    { "id": 1, "brand": "BMW", "model": "X5", ... },
    { "id": 2, "brand": "BMW", "model": "X3", ... }
  ],
  "meta": { "total": 5, "current_page": 1 }
}
```

---

### **Test 2: Filtrage par Ville**

#### Frontend

1. Sélectionner Ville → "Casablanca"
2. Observer:
   - ✅ Network: `?city=Casablanca&page=1`
   - ✅ UI: Voitures affichent "Casablanca" dans city

#### Backend

```bash
curl "http://localhost:8000/api/catalog?city=Casablanca"
```

**Vérification:**

```sql
-- Devrait créer un whereHas('agency', ...)
SELECT cars.* FROM cars
JOIN agencies ON cars.agency_id = agencies.id
WHERE agencies.city = 'Casablanca'
```

---

### **Test 3: Filtrage par Carburant**

#### Frontend

1. Sélectionner Fuel → "diesel"
2. Observer:
   - ✅ Network: `?fuel=diesel`
   - ✅ Cartes affichent "Diesel" dans specs

#### Backend

```bash
curl "http://localhost:8000/api/catalog?fuel=diesel"
```

**Résultat:**

```json
{
  "data": [ { "fuel": "diesel", ... } ],
  "meta": { "total": 12 }
}
```

---

### **Test 4: Filtrage par Prix Maximum**

#### Frontend

1. Déplacer slider Prix à 2000
2. Observer:
   - ✅ Network: `?max_price=2000`
   - ✅ Cartes affichent uniquement prix ≤ 2000

#### Backend

```bash
curl "http://localhost:8000/api/catalog?max_price=2000"
```

**Vérification SQL:**

```sql
WHERE price_per_day <= 2000
```

---

### **Test 5: Filtre Combiné**

#### Frontend

1. Sélectionner:
   - Brand: "BMW"
   - City: "Casablanca"
   - Fuel: "diesel"
   - Max Price: 2500

2. Observer URL:

```
?brand=BMW&city=Casablanca&fuel=diesel&max_price=2500&sort=price_asc&page=1
```

#### Backend

```bash
curl "http://localhost:8000/api/catalog?brand=BMW&city=Casablanca&fuel=diesel&max_price=2500"
```

---

### **Test 6: Tri (Sort)**

#### Frontend

1. Sélectionner Tri → "Prix décroissant"
2. Observer:
   - ✅ Network: `?sort=price_desc`

#### Vérifier

```sql
-- price_desc
ORDER BY price_per_day DESC

-- price_asc
ORDER BY price_per_day ASC

-- newest (défaut)
ORDER BY created_at DESC
```

---

### **Test 7: Pagination**

#### Frontend

1. Afficher page 1
2. Cliquer "Suivant" → page 2
3. Observer:
   - ✅ Network: `?page=2`
   - ✅ Pagination: "Affichage de 13–24 sur 48"

#### Redux DevTools

```js
// Payload du thunk
{
  "data": [...12 items...],
  "meta": {
    "current_page": 2,
    "last_page": 4,
    "total": 48,
    "per_page": 12
  }
}
```

---

### **Test 8: Rechercheche Texte**

#### Frontend

1. Saisir "BMW X5" dans Search
2. Observer:
   - ✅ 400ms debounce (attendre avant API)
   - ✅ Network: `?search=BMW%20X5`

#### Backend

```bash
curl "http://localhost:8000/api/catalog?search=BMW"
```

**Vérifier:**

```sql
WHERE brand LIKE '%BMW%' OR model LIKE '%BMW%'
```

---

### **Test 9: Reset Filtres**

#### Frontend

1. Sélectionner plusieurs filtres
2. Cliquer "Réinitialiser les filtres"
3. Observer:
   - ✅ Tous les selects retournent à vide
   - ✅ Slider retourne à 3000
   - ✅ Search vide
   - ✅ Network: nouvelle requête sans params

---

### **Test 10: Empty State**

#### Frontend

1. Filtrer par: brand="Ferrari" + fuel="électrique"
2. Si 0 résultats:
   - ✅ Affiche "Aucun véhicule trouvé" 🚗
   - ✅ Suggestion de modifier les filtres

---

## 🖥️ Exemples cURL

### Sans filtres

```bash
curl "http://localhost:8000/api/catalog?page=1"
```

### Tous les filtres

```bash
curl "http://localhost:8000/api/catalog?page=1&brand=BMW&city=Casablanca&fuel=diesel&max_price=3000&search=&sort=price_asc&status="
```

### Filtres + Sort DESC

```bash
curl "http://localhost:8000/api/catalog?brand=Mercedes&sort=price_desc&page=1"
```

### Recherche

```bash
curl "http://localhost:8000/api/catalog?search=BMW%20X5"
```

---

## 📊 Console Logs à Vérifier

### ✅ Logs Attendus

```javascript
// Au chargement de page
🚀 [fetchCars] Appel API avec params: { page: 1, search: "", ... }
📦 fetchCars: Structure PAGINÉE (data + meta) { count: 12, ... }

// Lors d'un filtre
🚀 [fetchCars] Appel API avec params: { page: 1, brand: "BMW", ... }
📦 fetchCars: Structure PAGINÉE (data + meta) { count: 8, current_page: 1, last_page: 1, total: 8 }

// En cas d'erreur
❌ fetchCars: Erreur { message: "error", status: 500 }
```

### ✅ Redux DevTools

1. Ouvrir Redux DevTools
2. Chercher l'action `catalog/fetchCars`
3. Vérifier le Payload:

```json
{
  "data": [
    { "id": 1, "brand": "BMW", "model": "X5", "fuel": "diesel", "price_per_day": 2500, ... }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "total": 48,
    "per_page": 12,
    "from": 1,
    "to": 12,
    "path": "http://localhost:8000/api/catalog"
  }
}
```

---

## 🔍 Debugging

### Problème 1: Filtres ne s'appliquent pas

```
✅ Vérifier:
  1. Network tab: params dans l'URL ?
  2. Console: fetchCars log avec params ?
  3. Backend: logs de CarSearchService
  4. Database: données existent pour ce filtre ?
```

### Problème 2: Pagination incorrecte

```
✅ Vérifier:
  1. Réponse meta: current_page, last_page, total présents ?
  2. Redux: state.pagination stocke meta correctement ?
  3. Pagination.jsx: utilise les bonnes clés ?
```

### Problème 3: City n'affiche pas

```
✅ Vérifier:
  1. CarCardResource: city et agency_name inclus ?
  2. API response: contient "city" et "agency_name" ?
  3. CarCard.jsx: destructure correctement ?
  4. Agency existe et a une city ?
```

### Problème 4: Search ne fonctionne pas

```
✅ Vérifier:
  1. Debounce 400ms s'applique ?
  2. Valeur saisie s'envoie comme param search ?
  3. Backend LIKE '%search%' s'applique ?
```

---

## ✅ Checklist Final

- [ ] Filtre Brand fonctionne
- [ ] Filtre City fonctionne
- [ ] Filtre Fuel (pas transmission) fonctionne
- [ ] Filtre Max Price fonctionne
- [ ] Recherche texte fonctionne (debounce)
- [ ] Tri fonctionne (asc/desc/newest)
- [ ] Pagination navigue et affiche correctement
- [ ] Reset réinitialise tout
- [ ] City affiche sur les cartes
- [ ] Empty state s'affiche si 0 résultats
- [ ] Console logs sont structurés
- [ ] Redux DevTools montre la structure correcte

---

## 📞 Troubleshooting

Si un test échoue:

1. Vérifier les logs console (F12)
2. Inspecter Network tab (F12)
3. Vérifier la requête SQL via `QueryLog` ou migrations
4. Consulter `FILTRAGE_CARS_GUIDE.md`
