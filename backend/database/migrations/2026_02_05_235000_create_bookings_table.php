<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        DB::statement(<<<'SQL'
            CREATE TABLE `bookings` (
              `id` bigint unsigned NOT NULL AUTO_INCREMENT,
              `car_id` bigint unsigned NOT NULL,
              `user_id` bigint unsigned NOT NULL,
              `agency_id` bigint unsigned NOT NULL,
              `start_date` date NOT NULL,
              `end_date` date NOT NULL,
              `total_price` decimal(10,2) NOT NULL,
              `status` enum('pending', 'confirmed', 'canceled', 'completed') NOT NULL DEFAULT 'pending',
              `created_at` timestamp NULL DEFAULT NULL,
              `updated_at` timestamp NULL DEFAULT NULL,
              PRIMARY KEY (`id`),
              CONSTRAINT `fk_bookings_car_id` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE,
              CONSTRAINT `fk_bookings_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
              CONSTRAINT `fk_bookings_agency_id` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
