<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id(); // booking_id

            // Relations
            $table->foreignId('car_id')
                  ->constrained('cars')
                  ->cascadeOnDelete();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete(); // client

            $table->foreignId('agency_id')
                  ->constrained('agencies')
                  ->cascadeOnDelete();

            // Dates de réservation
            $table->date('start_date');
            $table->date('end_date');

            // Prix total
            $table->decimal('total_price', 10, 2);

            // Statut
            $table->enum('status', [
                'pending',
                'confirmed',
                'canceled',
                'completed'
            ])->default('pending');

            $table->timestamps();

            // Index utiles
            $table->index(['car_id', 'start_date', 'end_date']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
