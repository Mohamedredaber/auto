<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            Schema::create('car_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('car_id')
                ->constrained('cars')
                ->cascadeOnDelete();

            $table->string('url');        
            $table->boolean('is_cover')->default(false); // image principale

            $table->timestamps();

            $table->index('car_id');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('car_images');
    }
};
