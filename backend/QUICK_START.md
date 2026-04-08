# 🚀 Quick Start - Car Management API

## Setup & Testing Guide

### 1. **Run Database Migrations**

Ensure your database is set up with all tables:

```bash
cd backend
php artisan migrate
```

### 2. **Create Test Agency & User**

```bash
php artisan tinker

// In tinker shell:
$agency = \App\Models\Agency::create(['name' => 'Test Agency', 'city' => 'Tanger']);
$user = \App\Models\User::create([
    'first_name' => 'Admin',
    'last_name' => 'Agency',
    'email' => 'admin@agency.com',
    'password' => bcrypt('password'),
    'role' => 'admin_agency',
    'agency_id' => $agency->id,
]);
exit
```

### 3. **Get Bearer Token**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@agency.com",
    "password": "password"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "token": "xxxxxxxx|yyyyyyyyyyyy...",
    "user": {...}
  }
}
```

**Copy the token and use it in the headers for all requests:**

```
Authorization: Bearer xxxxxxxx|yyyyyyyyyyyy...
```

### 4. **Test Endpoints**

#### A. List Cars

```bash
curl -X GET http://localhost:8000/api/agency/cars \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

#### B. Create a Car

```bash
curl -X POST http://localhost:8000/api/agency/cars \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "brand=BMW" \
  -F "model=X5" \
  -F "category=SUV" \
  -F "year=2024" \
  -F "transmission=automatic" \
  -F "fuel=diesel" \
  -F "seats=5" \
  -F "doors=4" \
  -F "price_per_day=450.00" \
  -F "status=available" \
  -F "cover_image_url=@/path/to/image.jpg" \
  -F "additional_information=Leather seats"
```

**Save the car `id` from response for next steps**

#### C. Get Car Details

```bash
curl -X GET http://localhost:8000/api/agency/cars/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

#### D. Update Car

```bash
curl -X PUT http://localhost:8000/api/agency/cars/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "price_per_day=500.00" \
  -F "status=reserved"
```

#### E. Update Car Image

```bash
curl -X PUT http://localhost:8000/api/agency/cars/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cover_image_url=@/path/to/new-image.jpg"
```

#### F. Delete Car

```bash
curl -X DELETE http://localhost:8000/api/agency/cars/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

---

## Using Postman/Insomnia

### Import Collection

1. Open Postman/Insomnia
2. Click **Import** → **Upload Files**
3. Select `postman_collection_cars.json` from backend root
4. Set `{{base_url}}` variable to your server URL
5. Set `Authorization` header token after login

---

## Run Feature Tests

```bash
cd backend

# Run all car tests
php artisan test tests/Feature/Agency/CarControllerTest.php

# Run specific test
php artisan test tests/Feature/Agency/CarControllerTest.php --filter test_store_creates_car_with_valid_data

# Run tests with verbose output
php artisan test tests/Feature/Agency/CarControllerTest.php -v
```

---

## Common Issues & Solutions

### ❌ "Token not provided"

- **Solution**: Add `Authorization: Bearer YOUR_TOKEN` header to request

### ❌ "Accès refusé. Rôle 'admin_agency' requis"

- **Solution**: User must have role `'admin_agency'`
- Check: `$user->role === 'admin_agency'`

### ❌ "No query results found"

- **Solution**: Car doesn't exist or belongs to different agency
- Verify: `car.agency_id === auth()->user()->agency_id`

### ❌ "The given data was invalid"

- **Solution**: Check validation errors in response
- Common: Missing required field, invalid enum, wrong file type

### ❌ Image upload fails

- **Solution**: Ensure:
    - File is image (JPEG, PNG, JPG, WEBP)
    - File size ≤ 5MB
    - `storage/app/public` is writable
    - Run: `php artisan storage:link`

### ❌ "No files found in uploads directory"

- **Solution**: Update `.env`

```
FILESYSTEM_DISK=public
```

---

## Database Structure

### cars table

```
id (PK)
agency_id (FK)
brand, model, category, year
transmission, fuel, seats, doors
price_per_day, status
available_from, available_to
additional_information
created_at, updated_at
```

### car_images table

```
id (PK)
car_id (FK)
url
is_cover (boolean)
created_at, updated_at
```

---

## Response Examples

### Create Car Success (201)

```json
{
    "success": true,
    "message": "Voiture créée avec succès.",
    "data": {
        "id": 42,
        "agency_id": 1,
        "brand": "BMW",
        "model": "X5",
        "category": "SUV",
        "year": 2024,
        "transmission": "automatic",
        "fuel": "diesel",
        "seats": 5,
        "doors": 4,
        "price_per_day": 450.5,
        "status": "available",
        "cover_image_url": "http://localhost:8000/storage/cars/uuid.jpg",
        "additional_information": "Leather seats",
        "created_at": "2026-04-08 14:22:00",
        "updated_at": "2026-04-08 14:22:00"
    }
}
```

### Validation Error (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "brand": ["La marque est obligatoire"],
        "cover_image_url": ["L'image doit être un fichier image"]
    }
}
```

### Authorization Error (403)

```json
{
    "success": false,
    "message": "Accès refusé. Rôle 'admin_agency' requis."
}
```

---

## Files Created/Modified

✅ **Form Requests**

- `app/Http/Requests/Agency/StoreCarRequest.php` - Create validation
- `app/Http/Requests/Agency/UpdateCarRequest.php` - Update validation

✅ **Controller**

- `app/Http/Controllers/Agency/CarController.php` - All CRUD methods

✅ **Resource**

- `app/Http/Resources/Agency/CarResource.php` - JSON formatting

✅ **Documentation**

- `API_CARS_DOCUMENTATION.md` - Complete API docs
- `IMPLEMENTATION_SUMMARY.md` - What's been done
- `postman_collection_cars.json` - Postman/Insomnia collection

✅ **Tests**

- `tests/Feature/Agency/CarControllerTest.php` - 15+ test cases

---

## Next Steps

1. ✅ Test all endpoints with provided curl examples
2. ✅ Import Postman collection for better UI
3. ✅ Run feature tests: `php artisan test`
4. ✅ Integrate React frontend (use provided API URLs)
5. ✅ Deploy to production

---

## Need Help?

- 📖 See `API_CARS_DOCUMENTATION.md` for full endpoint details
- 🧪 See `CarControllerTest.php` for test examples
- 📬 Check Postman collection for request/response examples

---

## Performance Tips

- Images are cached with `asset()` helper
- Queries use eager loading (no N+1)
- Pagination limits results to 10 per page
- Database indexes on frequently queried columns

---

## Security Checklist

✅ Agency isolation (users only see their cars)
✅ Role-based access (admin_agency only)
✅ Input validation (all fields)
✅ File upload validation (type, size)
✅ agency_id enforced from auth user
✅ Secure storage cleanup on delete

You're all set! 🎉
