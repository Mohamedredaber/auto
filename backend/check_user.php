<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('email', 'admin@example.com')->first();
if ($user) {
    echo "User found: " . $user->first_name . ' ' . $user->last_name . ' - Role: ' . $user->role . ' - Password: ' . $user->password . "\n";
} else {
    echo "User not found\n";
}