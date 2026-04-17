# 📄 Architecture CarDetails - Documentation Complète

## 📋 Vue d'Ensemble

La page `DetailsCars` a été restructurée avec une architecture professionnelle et modulaire, respectant les principes de réutilisabilité et de maintenabilité.

### **Structure des Fichiers**

```
frontend/src/
├── pages/public/cars/
│   ├── DetailsCars.jsx                    (Orchestrator principal)
│   └── components/CarDetails/
│       ├── Breadcrumb.jsx                 (Navigation)
│       ├── ImageGallery.jsx               (Galerie avec navigation)
│       ├── KeySpecs.jsx                   (Caractéristiques clés)
│       ├── PricingCard.jsx                (Prix + Réservation)
│       ├── AboutSection.jsx               (À propos du véhicule)
│       └── AgencyCard.jsx                 (Infos agence)
│
├── hooks/
│   └── useCarDetails.js                   (Hook personnalisé)
│
└── styles/pages/
    ├── car-details.css                    (Layout principal)
    └── styles/components/
        ├── breadcrumb-details.css
        ├── image-gallery-details.css
        ├── key-specs-details.css
        ├── pricing-card-details.css
        ├── about-section-details.css
        └── agency-card-details.css
```

---

## 🔧 Composants Détail

### **1. DetailsCars.jsx** (Composant Principal)

**Rôle :** Orchestrateur central qui gère la logique globale

**Fonctionnalités :**

- Chargement des données de la voiture via `useCarDetails(id)`
- Gestion des états : loading, error, success
- Composition et positionnement des sous-composants
- Layout 2 colonnes (main + sidebar sticky)

**Props :** Aucune (route basée sur `useParams`)

**États :**

```jsx
{
  car: Object,       // Voiture chargée
  loading: Boolean,  // État chargement
  error: Object|null // Erreur éventuelle
}
```

---

### **2. Breadcrumb.jsx**

**Rôle :** Navigation hiérarchique

**Props :**

```jsx
{
  car: {
    brand: String,
    model: String
  }
}
```

**Chemin :** Accueil → Voitures → Brand Model

---

### **3. ImageGallery.jsx**

**Rôle :** Galerie d'images interactive

**Features :**

- Image principale avec zoom au survol
- Navigation flèches (prev/next)
- Compteur d'images (1/8)
- Thumbnails pour sélection rapide
- Fallback image par défaut

**Props :**

```jsx
{
  car: {
    cover_image: String,  // Image par défaut
    gallery: Array        // [ {id, url, is_cover}, ... ]
  }
}
```

**Hooks Internes :**

- `useState()` - Image sélectionnée
- `useCallback()` - Handlers de navigation

---

### **4. KeySpecs.jsx**

**Rôle :** Affichage des caractéristiques clés

**Données affichées :**

- Transmission
- Carburant
- Sièges
- Climatisation

**Props :**

```jsx
{
  car: {
    transmission: String,
    fuel: String,
    seats: Number
  }
}
```

---

### **5. PricingCard.jsx**

**Rôle :** Tarification et réservation

**Features :**

- Sélecteur de dates (départ/retour)
- Calcul automatique des jours et prix
- Détail de la tarification (location + assurance)
- Total calculé
- Conditions de location (checkboxes)
- Bouton réservation → redirection login

**Props :**

```jsx
{
  car: {
    id: Number,
    price_per_day: Number,
    brand: String,
    model: String
  }
}
```

**Hooks Internes :**

- `useState()` - Dates sélectionnées
- `useCallback()` - Handlers dates et réservation
- `useNavigate()` - Redirection

**Calculs :**

```jsx
days = (end_date - start_date) / (24*60*60*1000)
location_price = days * price_per_day
insurance = 300 MAD (fixe)
total = location_price + insurance
```

---

### **6. AboutSection.jsx**

**Rôle :** Description et fonctionnalités du véhicule

**Sections :**

1. Description générale
2. 3 Features principales :
   - 🛡️ Protection Totale
   - 🔄 Utilisation Flexible
   - 🛣️ Kilométrage Illimité

**Props :**

```jsx
{
  car: {
    description: String;
  }
}
```

---

### **7. AgencyCard.jsx**

**Rôle :** Informations et contact de l'agence

**Affiche :**

- Logo/Avatar agence
- Nom et rating (étoiles + nombre d'avis)
- 3 détails (vérifiée, support 24/7, paiement sécurisé)
- 2 boutons : Contacter / Voir profil
- Localisation (ville)

**Props :**

```jsx
{
  car: {
    agency: {
      id: Number,
      name: String,
      city: String,
      totalReviews: Number
    }
  }
}
```

**Hooks Internes :**

- `useCallback()` - Actions contact/profil

---

## 🎣 Hook Personnalisé

### **useCarDetails(carId)**

**Localisation :** `frontend/src/hooks/useCarDetails.js`

**Purpose :** Encapsuler la logique de chargement d'une voiture

**Returns :**

```jsx
{
  car: Object,           // Voiture ou null
  loading: Boolean,      // Chargement en cours
  error: Object|null    // Message erreur
}
```

**Utilisation :**

```jsx
const { car, loading, error } = useCarDetails(carId);
```

**Under the hood :**

- `useEffect()` - Trigger fetchCarById sur changement de carId
- `useDispatch()` - Appelle Redux action
- `useSelector()` - Récupère depuis Redux store

---

## 🎨 CSS Architecture

### **Fichiers CSS Créés**

| Fichier                     | Classes          | Points clés                            |
| --------------------------- | ---------------- | -------------------------------------- |
| `car-details.css`           | `.car-details`   | Layout 2 colonnes, états loading/error |
| `breadcrumb-details.css`    | `.breadcrumb`    | Navigation path                        |
| `image-gallery-details.css` | `.image-gallery` | Galerie responsive, flèches de nav     |
| `key-specs-details.css`     | `.key-specs`     | Grid 4 colonnes responsive             |
| `pricing-card-details.css`  | `.pricing-card`  | Tarification avec sticky sidebar       |
| `about-section-details.css` | `.about-section` | 3 features cards hover effects         |
| `agency-card-details.css`   | `.agency-card`   | Contact card avec CTA buttons          |

### **CSS Principles**

1. **Responsive Design** : Breakpoints @768px, @640px
2. **CSS Variables** : Utilise variables de couleur/espacement
3. **Transitions** : Effects smooth sur interactions
4. **Accessibility** : Labels, alt text, contrast colors

---

## 📱 Responsive Behavior

### **Desktop (>1024px)**

- Grille 2 colonnes : main (2/3) + sidebar sticky (1/3)
- Galerie: aspect-ratio 4/3
- Key specs: 4 colonnes

### **Tablet (768px - 1024px)**

- Grille 2 colonnes convertie en 1 colonne
- Sidebar perd sticky
- Key specs: 2 colonnes

### **Mobile (<640px)**

- 1 colonne full-width
- Galerie: aspect-ratio 3/2
- Key specs: 2 colonnes
- Buttons expandus

---

## 🔄 Flux de Données

```
URL: /cars/:id
  ↓
DetailsCars.jsx
  ↓
useCarDetails(id)
  ↓
dispatch(fetchCarById(id))
  ↓
Redux → selectSelectedCar
  ↓
{ car, loading, error }
  ↓
Render sub-components
  ↓
Breadcrumb
ImageGallery
KeySpecs
PricingCard (avec state dates)
AboutSection
AgencyCard
```

---

## 🎯 Cas d'Utilisation

### **Scénario 1 : Affichage d'une voiture**

1. Utilisateur clique sur une voiture depuis la page `/cars`
2. Redirection vers `/cars/:id`
3. `DetailsCars` charge les données
4. Tous les composants affichent les infos

### **Scénario 2 : Réservation**

1. Utilisateur sélectionne dates dans `PricingCard`
2. Clique "Réserver maintenant"
3. Redirection vers `/login` avec state contenant :
   - `carId`
   - `dates`
   - URL de retour

### **Scénario 3 : Erreur chargement**

1. Voiture n'existe pas (ID invalide)
2. État error affiché
3. Bouton "Retour aux voitures"

---

## 🧪 Testing

### **Composants à tester**

```jsx
// Test 1: DetailsCars charge les données
render(<DetailsCars />);
await waitFor(() => expect(screen.getByText(/BMW/i)).toBeInTheDocument());

// Test 2: Galerie navigation
const nextBtn = screen.getByAriaLabel("Image suivante");
fireEvent.click(nextBtn);
// Vérifier que l'image a changé

// Test 3: Pricing calculation
const startInput = screen.getByDisplayValue("2024-06-01");
fireEvent.change(startInput, { target: { value: "2024-06-05" } });
// Vérifier que le total a été recalculé

// Test 4: Breadcrumb navigation
const back = screen.getByText("Voitures");
fireEvent.click(back);
// Vérifier navigation vers /cars
```

---

## 🚀 Bonnes Pratiques Appliquées

✅ **Separation of Concerns** : Chaque composant a une responsabilité unique
✅ **Reusability** : Composants totalement indépendants
✅ **Performance** : useCallback pour éviter re-renders inutiles
✅ **Accessibility** : Labels, alt text, ARIA labels
✅ **Responsiveness** : Mobile-first approach
✅ **Error Handling** : States loading/error gérés
✅ **CSS Organization** : 1 fichier CSS par composant
✅ **Code Clarity** : Noms explicites, documentation

---

## 📝 Exemple d'Extension

### **Ajouter un composant "Reviews"**

1. Créer `frontend/src/pages/public/cars/components/CarDetails/ReviewsSection.jsx`
2. Créer `frontend/src/styles/components/reviews-section-details.css`
3. Ajouter dans `DetailsCars.jsx` :

```jsx
import ReviewsSection from "./components/CarDetails/ReviewsSection";

// Dans le render:
<ReviewsSection car={car} />;
```

---

## 🔗 Liens Utiles

- Redux Selectors: `catalogSelectors.js`
- Redux Thunks: `catalogThunks.js`
- Hook: `useCarDetails.js`
- Route: `AppRoutes.jsx` → `/cars/:id`

---

## ⚡ Checklist Avant Déploiement

- [ ] Vérifier que la route `/cars/:id` fonctionne
- [ ] Tester galerie multi-images
- [ ] Tester calcul pricing
- [ ] Tester création réservation
- [ ] Tester cas: voiture non trouvée
- [ ] Vérifier responsive mobile
- [ ] Vérifier tous les liens agence
- [ ] Tester fallback image
- [ ] Vérifier accessibilité (keyboard nav)
- [ ] Vérifier performance images
