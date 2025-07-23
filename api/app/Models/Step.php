<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Step extends Model
{
    public $guarded = [];

    public static function boot(): void
    {
        parent::boot();
        static::creating(function (Step $step) {
            $step->uuid = \Illuminate\Support\Str::uuid7();
        });
    }

    public function snippet(): BelongsTo
    {
        return $this->belongsTo(Snippet::class);
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function afterOrder(): float | int
    {
        return 0;
    }

    public function beforeOrder(): float | int
    {
        return 0;
    }
}
