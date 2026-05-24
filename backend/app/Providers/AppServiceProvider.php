<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL; // <-- N'oublie pas d'ajouter cet import

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // 🔥 Force Laravel à utiliser l'URL du backend (http://localhost:8000)
        // même si on passe par le proxy de Vite (5173)
        if (config('app.env') === 'local') {
            URL::forceRootUrl(config('app.url'));
        }
    }
}