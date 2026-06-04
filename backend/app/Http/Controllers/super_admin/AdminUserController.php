<?php

namespace App\Http\Controllers\super_admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request)
{
    $validated = $request->validate([
        'search' => ['nullable', 'string', 'max:255'],
        'role' => ['nullable', 'in:client,admin_agency,super_admin'],
        'agency_name' => ['nullable', 'string', 'max:255'],
        'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
    ]);

    $perPage = $validated['per_page'] ?? 10;

    $users = User::with('agency')
        ->when($request->filled('search'), function ($query) use ($request) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('agency', function ($agencyQuery) use ($search) {
                        $agencyQuery->where('agency_name', 'like', "%{$search}%");
                    });
            });
        })
        ->when($request->filled('role'), function ($query) use ($request) {
            $query->where('role', $request->role);
        })
        ->when($request->filled('agency_name'), function ($query) use ($request) {
            $query->whereHas('agency', function ($agencyQuery) use ($request) {
                $agencyQuery->where('agency_name', 'like', "%{$request->agency_name}%");
            });
        })
        ->latest('id')
        ->paginate($perPage)
        ->appends($request->query());

    return response()->json([
        'success' => true,
        'message' => 'Liste des utilisateurs récupérée.',
        'data' => collect($users->items())->map(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'agency_id' => $user->agency_id,
                'agency_name' => $user->agency?->agency_name,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ];
        }),

        'pagination' => [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
            'from' => $users->firstItem(),
            'to' => $users->lastItem(),
            'prev_page_url' => $users->previousPageUrl(),
            'next_page_url' => $users->nextPageUrl(),
        ],
    ]);
}

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'email' => ['required', 'email', 'max:191', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:191'],
            'role' => ['required', Rule::in(['client', 'admin_agency', 'super_admin'])],
            'agency_id' => ['nullable', 'integer', 'exists:agencies,id'],
        ]);

        

        if ($data['role'] !== 'admin_agency') {
            $data['agency_id'] = null;
        }

        $user = User::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès.',
            'data' => $user,
        ], 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails utilisateur récupérés.',
            'data' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'first_name' => ['sometimes', 'required', 'string', 'max:191'],
            'last_name' => ['sometimes', 'required', 'string', 'max:191'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:191',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:191'],
            'role' => ['sometimes', 'required', Rule::in(['client', 'admin_agency', 'super_admin'])],
            'agency_id' => ['nullable', 'integer', 'exists:agencies,id'],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        if (($data['role'] ?? $user->role) !== 'admin_agency') {
            $data['agency_id'] = null;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès.',
            'data' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'super_admin') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un super admin.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }

    public function stats()
{
    return response()->json([
        'success' => true,
        'message' => 'Statistiques des utilisateurs récupérées.',
        'data' => [
            'total_users' => User::count(),
            'total_clients' => User::where('role', 'client')->count(),
            'total_admin_agencies' => User::where('role', 'admin_agency')->count(),
            'total_super_admins' => User::where('role', 'super_admin')->count(),
        ],
    ]);
}
}