<?php
// app/Mail/ContactConfirmationMail.php
// Mail envoyé à l'utilisateur après son envoi

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Votre message a bien été reçu');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact-confirmation');
    }
}