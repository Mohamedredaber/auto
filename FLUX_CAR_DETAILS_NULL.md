# 📊 DIAGRAMME DU FLUX - Pourquoi car_details est NULL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    API CLIENT: GET /api/client/bookings                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BookingController::index()                                                  │
│  → Appelle BookingService::getUserBookings()                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BookingService::getUserBookings()                                          │
│                                                                              │
│  $booking = Booking::where('user_id', auth()->id())                         │
│             ->with(['car', 'agency'])  ← CHARGE LES RELATIONS             │
│             ->get();                                                         │
│                                                                              │
│  ✅ Si 'car' existe → charge la voiture                                     │
│  ❌ Si 'car' est NULL → $booking->car sera NULL                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BookingResource::toArray()  ← FORMATE LA RÉPONSE                           │
│                                                                              │
│  'car_details' => $this->car ? [                                           │
│      'id' => $this->car->id,                                               │
│      'brand' => $this->car->brand,                                         │
│      ...                                                                     │
│  ] : null  ← SI CAR EST NULL, RETOURNE NULL                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Réponse JSON:                                                              │
│  {                                                                           │
│    "car_details": null,  ← ❌ PROBLÈME ICI                                 │
│    "agency_details": { ... }  ← ✅ OK                                      │
│  }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔴 **ENDROITS OÙ LE PROBLÈME PEUT SURVENIR:**

### **1️⃣ NIVEAU BD (Table bookings)**

```
bookings table:
┌────┬────────┬─────────┬────────────┐
│ id │ car_id │ user_id │ agency_id  │
├────┼────────┼─────────┼────────────┤
│ 3  │ NULL ❌│ 1       │ 8          │  ← car_id est NULL
│ 4  │ 999 ❌ │ 1       │ 8          │  ← car_id pointe vers une voiture inexistante
│ 5  │ 1  ✅ │ 1       │ 8          │  ← OK
└────┴────────┴─────────┴────────────┘

cars table:
┌────┬─────────┐
│ id │ brand   │
├────┼─────────┤
│ 1  │ Toyota  │  ← Existe
│ 2  │ BMW     │  ← Existe
│ 999│ (null)  │  ← N'EXISTE PAS
└────┴─────────┘

Résultat: booking #3 et #4 auront car_details = null
```

---

### **2️⃣ NIVEAU MODÈLE (Booking.php)**

```php
❌ MAUVAIS - Pas de relation définie:
public function car() {}  // Vide!

✅ BON - Relation correctement définie:
public function car() {
    return $this->belongsTo(Car::class);
}
```

---

### **3️⃣ NIVEAU SERVICE (BookingService.php)**

```php
❌ MAUVAIS - Oublie de charger la relation:
$booking = Booking::where('user_id', auth()->id())->get();
// Pas de ->with('car')

✅ BON - Charge la relation:
$booking = Booking::where('user_id', auth()->id())
    ->with(['car', 'agency'])
    ->get();
```

---

### **4️⃣ NIVEAU RESOURCE (BookingResource.php)**

```php
❌ MAUVAIS - Suppose que car existe toujours:
'car_details' => [
    'id' => $this->car->id,  // ❌ ERROR si $this->car est null
    ...
]

✅ BON - Vérifie que car existe:
'car_details' => $this->car ? [
    'id' => $this->car->id,
    ...
] : null,  // Retourne null si car est null
```

---

## 🧪 **COMMENT IDENTIFIER OÙ EST LE PROBLÈME:**

### **Étape 1: Vérifier la BD**

```sql
-- Voir si car_id est NULL
SELECT * FROM bookings WHERE car_id IS NULL;

-- Voir si car_id pointe vers une voiture inexistante
SELECT b.* FROM bookings b
WHERE b.car_id NOT IN (SELECT id FROM cars);
```

### **Étape 2: Vérifier la relation**

```php
// En tinker
$booking = App\Models\Booking::find(3);
dd($booking->car);  // Doit retourner la voiture, pas null
```

### **Étape 3: Vérifier le service**

```php
// En tinker
$booking = App\Models\Booking::with('car')->find(3);
dd($booking->car);  // Doit retourner la voiture
```

### **Étape 4: Vérifier la Resource**

```php
// En tinker
$resource = new App\Http\Resources\Client\BookingResource(
    App\Models\Booking::with('car')->find(3)
);
dd($resource->resolve());  // Doit avoir car_details
```

---

## ✅ **RÉSUMÉ:**

| Étape        | Vérifie                                    | Si NULL → Problème               |
| ------------ | ------------------------------------------ | -------------------------------- |
| **BD**       | `car_id` existe et pointe vers une voiture | car_id NULL ou voiture supprimée |
| **Modèle**   | Relation `belongsTo` définie               | Pas de relation                  |
| **Service**  | `->with('car')` charge la relation         | Oubli du with()                  |
| **Resource** | `$this->car` est accédé correctement       | Pas de null-check                |
