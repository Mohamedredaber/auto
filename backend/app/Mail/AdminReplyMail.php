<?php
// app/Mail/AdminReplyMail.php
// Mail envoyé à l'utilisateur quand l'admin répond

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Réponse à votre message — AutoConnect');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.admin-reply');
    }
}