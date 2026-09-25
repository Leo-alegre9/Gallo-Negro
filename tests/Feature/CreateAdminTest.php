<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CreateAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_review_account_does_not_use_a_team_slot(): void
    {
        $this->artisan('admin:create', ['email' => 'review@example.test', '--review' => true])
            ->expectsQuestion('Contraseña (mínimo 12 caracteres)', 'TestPassword123!')
            ->assertSuccessful();
        foreach (range(1, 3) as $index) {
            $this->artisan('admin:create', ['email' => "team{$index}@example.test"])
                ->expectsQuestion('Contraseña (mínimo 12 caracteres)', 'TestPassword123!')
                ->assertSuccessful();
        }
        $this->artisan('admin:create', ['email' => 'extra@example.test'])->assertFailed();
        $this->artisan('admin:create', ['email' => 'review2@example.test', '--review' => true])->assertFailed();
        $review = User::where('email', 'review@example.test')->firstOrFail();
        $this->assertTrue(Hash::check('TestPassword123!', $review->password));
        $this->actingAs($review)->get('/admin')->assertOk();
        $this->assertEquals(3, User::where('is_admin', true)->where('is_review_admin', false)->count());
    }
}
