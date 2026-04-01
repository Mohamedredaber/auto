<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test client
        User::create([
            'first_name' => 'Client',
            'last_name' => 'Test',
            'email' => 'client@example.com',
            'password' => 'password',
            'phone' => '0123456789',
            'role' => 'client',
        ]);

        // Create test agency admin
        User::create([
            'first_name' => 'Agency',
            'last_name' => 'Admin',
            'email' => 'agency@example.com',
            'password' => 'password',
            'phone' => '0123456789',
            'role' => 'admin_agency',
        ]);

        // Create test super admin
        User::create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'phone' => '0123456789',
            'role' => 'super_admin',
        ]);
    }
}