<?php
// app/Http/Controllers/ContactController.php

namespace App\Http\Controllers;

use App\Http\Requests\ContactMessageRequest;
use App\Http\Requests\ReplyContactRequest;
use App\Mail\AdminReplyMail;
use App\Mail\ContactConfirmationMail;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    // ── PUBLIC ────────────────────────────────────────────────

    public function store(ContactMessageRequest $request): JsonResponse
    {
        $contact = ContactMessage::create($request->validated());

        Mail::to($contact->email)
            ->send(new ContactConfirmationMail($contact));

        return response()->json([
            'success' => true,
            'message' => 'Votre message a bien été envoyé.',
        ], 201);
    }

    // ── ADMIN ─────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        $messages = ContactMessage::latest()
            ->select('id', 'name', 'email', 'subject', 'status', 'created_at')
            ->paginate(15);

        return response()->json(['success' => true, 'data' => $messages]);
    }

    public function show(ContactMessage $contact): JsonResponse
    {
        $contact->markAsRead();

        return response()->json(['success' => true, 'data' => $contact]);
    }

    public function reply(ReplyContactRequest $request, ContactMessage $contact): JsonResponse
    {
        $contact->update([
            'reply'      => $request->reply,
            'status'     => 'replied',
            'replied_at' => now(),
        ]);

        Mail::to($contact->email)
            ->send(new AdminReplyMail($contact));

        return response()->json([
            'success' => true,
            'message' => 'Réponse envoyée avec succès.',
        ]);
    }

    public function destroy(ContactMessage $contact): JsonResponse
    {
        $contact->delete();

        return response()->json(['success' => true]);
    }
}