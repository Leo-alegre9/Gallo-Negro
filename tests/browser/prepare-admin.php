<?php

// Isolated browser fixture; never loads or modifies the application's database.
$path = dirname(__DIR__, 2).'/storage/framework/testing/browser-admin.sqlite';
if (!is_dir(dirname($path))) mkdir(dirname($path), 0777, true);
touch($path);
putenv('APP_ENV=testing');
putenv('DB_CONNECTION=sqlite');
putenv('DB_DATABASE='.$path);
require dirname(__DIR__, 2).'/vendor/autoload.php';
$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.connections.sqlite.database') !== $path) throw new RuntimeException('Unexpected database');
Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => Database\Seeders\CatalogSeeder::class, '--force' => true]);
App\Models\User::updateOrCreate(['email' => 'browser@example.test'], [
    'name' => 'Administrador de prueba', 'is_admin' => true,
    'password' => Illuminate\Support\Facades\Hash::make('OnlyForIsolatedBrowserTests'),
]);
echo "Isolated browser database ready.\n";
