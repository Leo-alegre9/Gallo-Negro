<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'csrfToken' => csrf_token(),
            'auth' => ['user' => $request->user()?->only('id', 'name', 'email')],
            'flash' => ['success' => $request->session()->get('success')],
        ];
    }
}
