<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('agencies', function (Blueprint $table) {
        $table->id();

        // Obligatoires
        $table->string('agency_name');
        $table->string('city');
        $table->string('address');

        // Localisation GPS (optionnel)
        // decimal(10,7) ~ précision GPS (7 chiffres après virgule)
        $table->decimal('latitude', 10, 7)->nullable();
        $table->decimal('longitude', 10, 7)->nullable();

        // Heures de travail (obligatoire)
        $table->time('time_start');
        $table->time('time_end');

        // Statut de vérification
        $table->enum('is_verified', ['verified', 'inverified', 'wait'])->default('wait');
        $table->string('logo');
        $table->json('accounts_social')->nullable();

        $table->timestamps();

        // Index utile pour recherches par ville
        $table->index('city');
    });
    }

    public function down(): void
    {
        Schema::dropIfExists('agencies');
    }
};
