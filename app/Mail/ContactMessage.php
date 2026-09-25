<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone,
        public string $topic,
        public string $body,
        public ?string $productName = null,
        public ?string $productUrl = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->email, $this->name)],
            subject: 'Nueva consulta web: '.$this->topic.' — '.$this->name,
        );
    }

    public function content(): Content
    {
        return new Content(text: 'emails.contact-message');
    }
}
