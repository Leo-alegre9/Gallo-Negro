<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('filtro') === 'sin-leer' ? 'sin-leer' : 'todas';

        $messages = ContactMessage::with('product:id,name,slug,deleted_at')
            ->when($filter === 'sin-leer', fn ($query) => $query->unread())
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (ContactMessage $message) => [
                'id' => $message->id,
                'name' => $message->name,
                'email' => $message->email,
                'phone' => $message->phone,
                'topic' => $message->topicLabel(),
                'message' => $message->message,
                'product' => $message->product ? [
                    'name' => $message->product->name,
                    'url' => $message->product->trashed() ? null : route('products.show', $message->product->slug),
                ] : null,
                'read' => $message->read_at !== null,
                'created_at' => $message->created_at,
            ]);

        return Inertia::render('Admin/Messages', [
            'messages' => $messages,
            'filter' => $filter,
            'counts' => [
                'all' => ContactMessage::count(),
                'unread' => ContactMessage::unread()->count(),
            ],
        ]);
    }

    public function update(Request $request, ContactMessage $message): RedirectResponse
    {
        $data = $request->validate(['read' => ['required', 'boolean']]);
        $message->update(['read_at' => $data['read'] ? now() : null]);

        return back();
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', 'La consulta se eliminó.');
    }
}
