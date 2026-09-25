<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAudit;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Audit', [
            'audits' => AdminAudit::with('user:id,name,email')->orderByDesc('id')->paginate(30),
        ]);
    }
}
