<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\HasApiTokens;
return new class extends Migration {
    use HasApiTokens;
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('first_name');
            $table->string('last_name');

            $table->string('email')->unique();
            $table->string('password');

            $table->string('phone');
            $table->enum('role', [
                'super_admin',
                'admin_agence',
                'employe_agence',
                'client'
            ])->default('client');

            $table->foreignId('agency_id')
                  ->nullable()
                  ->constrained('agencies')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
