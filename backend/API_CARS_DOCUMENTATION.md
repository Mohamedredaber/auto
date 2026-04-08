# Car Management API Documentation

## Overview

Complete CRUD API for managing agency vehicles. All endpoints are protected with Laravel Sanctum + `role:admin_agency` middleware.

**Base URL**: `/api/agency/cars`  
**Auth**: `Authorization: Bearer {token}`  
**Middleware**: `auth:sanctum`, `role:admin_agency`

---

## Endpoints

### 1. List All Cars (Index)

**Endpoint**: `GET /api/agency/cars`  
**Auth**: Required (ADMIN_AGENCY)  
**Response**: Paginated collection (10 per page)

#### Response Example:

```json
{
    "success": true,
    "message": "Liste des voitures récupérée avec succès.",
    "data": [
        {
            "id": 1,
            "agency_id": 5,
            "brand": "Toyota",
            "model": "Corolla",
            "category": "Economy",
            "year": 2023,
            "transmission": "automatic",
            "fuel": "gasoline",
            "seats": 5,
            "doors": 4,
            "price_per_day": 250.5,
            "status": "available",
            "available_from": "2026-04-08",
            "available_to": "2026-12-31",
            "cover_image_url": "https://yoursite.com/storage/cars/toyota.jpg",
            "additional_information": "Air conditioning, GPS included",
            "images": [
                {
                    "id": 1,
                    "url": "https://yoursite.com/storage/cars/toyota.jpg",
                    "is_cover": true
                }
            ],
            "created_at": "2026-02-15 10:30:00",
            "updated_at": "2026-02-15 10:30:00"
        }
    ],
    "meta": {
        "current_page": 1,
        "per_page": 10,
        "total": 25
    }
}
```

---

### 2. Create a Car (Store)

**Endpoint**: `POST /api/agency/cars`  
**Auth**: Required (ADMIN_AGENCY)  
**Content-Type**: `multipart/form-data`

#### Request Fields:

| Field                    | Type    | Required | Rules                                      |
| ------------------------ | ------- | -------- | ------------------------------------------ |
| `brand`                  | string  | ✅       | Max 100 chars                              |
| `model`                  | string  | ✅       | Max 100 chars                              |
| `category`               | string  | ✅       | E.g., "SUV", "Sedan", "Economy"            |
| `year`                   | integer | ✅       | Min 1990, Max current year                 |
| `transmission`           | enum    | ✅       | `manual` OR `automatic`                    |
| `fuel`                   | enum    | ✅       | `diesel`, `gasoline`, `hybrid`, `electric` |
| `seats`                  | integer | ✅       | Min 1, Max 10                              |
| `doors`                  | integer | ✅       | Min 2, Max 6                               |
| `price_per_day`          | decimal | ✅       | Min 0, Format: X.XX                        |
| `status`                 | enum    | ✅       | `available`, `reserved`, `maintenance`     |
| `available_from`         | date    | ❌       | Format: YYYY-MM-DD                         |
| `available_to`           | date    | ❌       | Format: YYYY-MM-DD                         |
| `cover_image_url`        | file    | ✅       | Image (jpeg, png, jpg, webp), Max 5MB      |
| `additional_information` | string  | ❌       | Max 1000 chars                             |

#### Example cURL:

```bash
curl -X POST http://localhost/api/agency/cars \
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
  -F "additional_information=Leather seats, panoramic roof"
```

#### Success Response (201):

```json
{
    "success": true,
    "message": "Voiture créée avec succès.",
    "data": {
        "id": 42,
        "agency_id": 5,
        "brand": "BMW",
        "model": "X5",
        "category": "SUV",
        "year": 2024,
        "transmission": "automatic",
        "fuel": "diesel",
        "seats": 5,
        "doors": 4,
        "price_per_day": 450.0,
        "status": "available",
        "available_from": null,
        "available_to": null,
        "cover_image_url": "https://yoursite.com/storage/cars/uuid-bmw-x5.jpg",
        "additional_information": "Leather seats, panoramic roof",
        "created_at": "2026-04-08 14:22:00",
        "updated_at": "2026-04-08 14:22:00"
    }
}
```

#### Error Response (422):

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "brand": ["La marque est obligatoire"],
        "fuel": [
            "Le carburant doit être: diesel, essence, hybride ou électrique"
        ],
        "cover_image_url": ["L'image ne doit pas dépasser 5MB"]
    }
}
```

---

### 3. Get Car Details (Show)

**Endpoint**: `GET /api/agency/cars/{id}`  
**Auth**: Required (ADMIN_AGENCY)  
**URL Params**: `id` (integer)

#### Response Example:

```json
{
    "success": true,
    "message": "Détails de la voiture récupérés.",
    "data": {
        "id": 1,
        "agency_id": 5,
        "brand": "Toyota",
        "model": "Corolla",
        "category": "Economy",
        "year": 2023,
        "transmission": "automatic",
        "fuel": "gasoline",
        "seats": 5,
        "doors": 4,
        "price_per_day": 250.5,
        "status": "available",
        "available_from": "2026-04-08",
        "available_to": "2026-12-31",
        "cover_image_url": "https://yoursite.com/storage/cars/toyota.jpg",
        "additional_information": "Air conditioning, GPS included",
        "images": [
            {
                "id": 1,
                "url": "https://yoursite.com/storage/cars/toyota.jpg",
                "is_cover": true
            }
        ],
        "created_at": "2026-02-15 10:30:00",
        "updated_at": "2026-02-15 10:30:00"
    }
}
```

---

### 4. Update a Car (Update)

**Endpoint**: `PUT /api/agency/cars/{id}`  
**Auth**: Required (ADMIN_AGENCY)  
**Content-Type**: `multipart/form-data`  
**URL Params**: `id` (integer)

#### Request Fields:

- All fields from **Store** are optional (`sometimes` rule)
- Only send fields you want to update

#### Example cURL (Update Price & Status):

```bash
curl -X PUT http://localhost/api/agency/cars/42 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "price_per_day=500.00" \
  -F "status=reserved"
```

#### Example cURL (Update Cover Image):

```bash
curl -X PUT http://localhost/api/agency/cars/42 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cover_image_url=@/path/to/new-image.jpg"
```

#### Success Response (200):

```json
{
    "success": true,
    "message": "Voiture mise à jour avec succès.",
    "data": {
        "id": 42,
        "agency_id": 5,
        "brand": "BMW",
        "model": "X5",
        "category": "SUV",
        "year": 2024,
        "transmission": "automatic",
        "fuel": "diesel",
        "seats": 5,
        "doors": 4,
        "price_per_day": 500.0,
        "status": "reserved",
        "available_from": null,
        "available_to": null,
        "cover_image_url": "https://yoursite.com/storage/cars/uuid-new-bmw.jpg",
        "additional_information": "Leather seats, panoramic roof",
        "updated_at": "2026-04-08 15:10:00"
    }
}
```

---

### 5. Delete a Car (Destroy)

**Endpoint**: `DELETE /api/agency/cars/{id}`  
**Auth**: Required (ADMIN_AGENCY)  
**URL Params**: `id` (integer)

#### Success Response (200):

```json
{
    "success": true,
    "message": "Voiture supprimée avec succès.",
    "data": null
}
```

#### Error Response (404):

```json
{
    "message": "No query results found for model [App\\Models\\Car].",
    "exception": "Illuminate\\Database\\Eloquent\\ModelNotFoundException"
}
```

---

## Security Features

### 1. Agency Isolation

- Users can only access cars from their own agency
- `agency_id` is **never taken from request body**—always uses `Auth::user()->agency_id`

### 2. Authentication & Authorization

- All endpoints require valid Sanctum token
- All endpoints require `admin_agency` role
- Automatic 401/403 responses for unauthorized users

### 3. Image Storage

- Images stored in `storage/app/public/cars/`
- Accessible via `asset('storage/...')` helper
- Old images automatically deleted on update/delete

### 4. Input Validation

- Enum validation (transmission, fuel, status)
- File type & size validation (images)
- Date validation
- Custom error messages in French

---

## HTTP Status Codes

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| 200  | OK - Request succeeded                   |
| 201  | Created - Resource created successfully  |
| 400  | Bad Request - Invalid input              |
| 401  | Unauthorized - Missing/invalid token     |
| 403  | Forbidden - Insufficient permissions     |
| 404  | Not Found - Resource doesn't exist       |
| 422  | Unprocessable Entity - Validation failed |
| 500  | Internal Server Error                    |

---

## Error Handling

### Validation Errors:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "brand": ["La marque est obligatoire"],
        "year": ["L'année doit être à partir de 1990"]
    }
}
```

### Authorization Errors:

```json
{
    "message": "Unauthorized",
    "status": 401
}
```

### Not Found:

```json
{
    "message": "No query results found for model [App\\Models\\Car]."
}
```

---

## Notes

- All timestamps are in **UTC** format: `YYYY-MM-DD HH:MM:SS`
- Prices are returned as **floats** with 2 decimal places
- Image URLs are **absolute paths** (full asset URLs)
- Pagination defaults to **10 items per page**
- All responses include `success` boolean flag

---

## Testing with React Frontend

The CarForm component expects the following from the API:

### For Creating:

```javascript
const formData = new FormData();
formData.append("brand", "BMW");
formData.append("model", "X5");
// ... other fields
formData.append("cover_image_url", imageFile); // File object

dispatch(createCarThunk(formData)); // Sends FormData as multipart/form-data
```

### For Updating:

```javascript
dispatch(
    updateCarThunk({
        id: 42,
        formData: formData, // Same structure as create
    }),
);
```

### For Deleting:

```javascript
dispatch(deleteCarThunk(42));
```

---

## Example React Integration

```javascript
// redux/carThunks.js
export const createCarThunk = createAsyncThunk(
    "agency/createCar",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await createCar(formData); // POST /api/agency/cars
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message },
            );
        }
    },
);

// api/carAPI.js
export const createCar = (formData) => {
    return api.post("/agency/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
```
