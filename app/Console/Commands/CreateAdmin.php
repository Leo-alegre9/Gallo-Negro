<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdmin extends Command
{
    protected $signature = 'admin:create {email : Correo del administrador} {--name= : Nombre visible} {--review : Cuenta adicional de revisión}';
    protected $description = 'Crea tres administradores y una cuenta adicional de revisión con contraseña privada';

    public function handle(): int
    {
        $email = mb_strtolower(trim($this->argument('email')));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Ingresá un correo válido.');
            return self::FAILURE;
        }
        $existing = User::where('email', $email)->first();
        $review = $this->option('review') || $existing?->is_review_admin;
        if ($review && User::where('is_admin', true)->where('is_review_admin', true)->where('email', '!=', $email)->exists()) {
            $this->error('Ya existe una cuenta adicional de revisión.');
            return self::FAILURE;
        }
        if (!$review && User::where('is_admin', true)->where('is_review_admin', false)->count() >= 3 && !$existing?->is_admin) {
            $this->error('Ya existen tres cuentas administradoras.');
            return self::FAILURE;
        }
        $password = $this->secret('Contraseña (mínimo 12 caracteres)');
        if (mb_strlen($password ?? '') < 12) {
            $this->error('La contraseña debe tener al menos 12 caracteres.');
            return self::FAILURE;
        }
        $user = User::updateOrCreate(['email' => $email], [
            'name' => $this->option('name') ?: strstr($email, '@', true),
            'password' => Hash::make($password),
            'is_admin' => true,
            'is_review_admin' => (bool) $review,
        ]);
        $this->info("Cuenta administradora lista: {$user->email}");
        return self::SUCCESS;
    }
}
