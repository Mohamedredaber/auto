<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
  public function handle(Request $request, Closure $next, string $role): Response
{
    // On vérifie si l'user est connecté ET s'il a le rôle passé en paramètre
    if (!$request->user() || !$request->user()->hasRole($role)) {
        return response()->json([
            'success' => false,
            'message' => "Accès refusé. Rôle '$role' requis.",
        ], 403);
    }

    return $next($request);
}
}
