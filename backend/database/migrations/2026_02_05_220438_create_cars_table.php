<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id(); // id_car

            // Relation agence
            $table->foreignId('agency_id')
                  ->constrained('agencies')
                  ->cascadeOnDelete();
            // Informations voiture
            $table->string('category');          
            $table->string('brand');             // Toyota, BMW...
            $table->string('model');             // Corolla, X5...
            $table->year('year');
            // Enums
            $table->enum('transmission', ['manual', 'automatic']);
            $table->enum('fuel', ['diesel', 'gasoline', 'hybrid', 'electric']);
            $table->unsignedTinyInteger('seats');
            $table->unsignedTinyInteger('doors');

            // Prix
            $table->decimal('price_per_day', 8, 2);
            // Statut
            $table->enum('status', ['available', 'reserved', 'maintenance'])
                  ->default('reserved');
            // Disponibilité 
            $table->date('available_from')->nullable();
            $table->date('available_to')->nullable();

            // Infos supplémentaires
            $table->text('additional_information')->nullable();

            $table->timestamps();

            // Index utiles
            $table->index(['agency_id', 'status']);
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
