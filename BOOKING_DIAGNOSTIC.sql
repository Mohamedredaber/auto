-- 🔍 DIAGNOSTIC RÉSERVATION #3

-- 1️⃣ Vérifier la réservation
SELECT * FROM bookings WHERE id = 3;

-- 2️⃣ Vérifier si car_id existe et pointe vers une voiture
SELECT 
    b.id as booking_id,
    b.car_id,
    b.start_date,
    b.end_date,
    b.total_price,
    b.status,
    c.id as car_id_exists,
    c.brand,
    c.model,
    c.agency_id,
    c.price_per_day
FROM bookings b
LEFT JOIN cars c ON b.car_id = c.id
WHERE b.id = 3;

-- 3️⃣ Vérifier l'agence
SELECT 
    b.id as booking_id,
    b.agency_id,
    a.id as agency_id_exists,
    a.agency_name,
    a.city
FROM bookings b
LEFT JOIN agencies a ON b.agency_id = a.id
WHERE b.id = 3;

-- 4️⃣ Vérifier si la voiture avec cet ID existe
SELECT COUNT(*) as car_count FROM cars WHERE id = (SELECT car_id FROM bookings WHERE id = 3);

-- 5️⃣ Vérifier les images de la voiture
SELECT 
    ci.id,
    ci.car_id,
    ci.url,
    ci.is_cover
FROM car_images ci
WHERE ci.car_id = (SELECT car_id FROM bookings WHERE id = 3);

-- 6️⃣ Vérifier l'utilisateur qui a fait la réservation
SELECT 
    b.id as booking_id,
    b.user_id,
    u.id as user_id_exists,
    u.name,
    u.email,
    u.role
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
WHERE b.id = 3;

-- 7️⃣ Lister TOUTES les réservations orphelines (car_id invalide)
SELECT 
    b.id,
    b.car_id,
    b.user_id,
    b.agency_id,
    b.status,
    CASE 
        WHEN b.car_id IS NULL THEN '❌ car_id est NULL'
        WHEN NOT EXISTS (SELECT 1 FROM cars WHERE id = b.car_id) THEN '❌ Voiture supprimée'
        ELSE '✅ OK'
    END as status_check
FROM bookings b
ORDER BY b.id DESC;

-- 8️⃣ Compter les problèmes
SELECT 
    COUNT(*) as total_bookings,
    SUM(CASE WHEN car_id IS NULL THEN 1 ELSE 0 END) as null_car_id,
    SUM(CASE WHEN car_id NOT IN (SELECT id FROM cars) THEN 1 ELSE 0 END) as orphaned_bookings
FROM bookings;
