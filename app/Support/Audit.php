<?php

namespace App\Support;

use App\Models\AdminAudit;
use Illuminate\Database\Eloquent\Model;

class Audit
{
    public static function record(string $action, Model $entity, ?array $before = null, ?array $after = null): void
    {
        AdminAudit::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity_type' => class_basename($entity),
            'entity_id' => (string) $entity->getKey(),
            'before' => $before,
            'after' => $after,
        ]);
    }
}
