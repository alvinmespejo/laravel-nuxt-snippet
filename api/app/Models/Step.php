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
        $adjacent = self::where('order', '>', $this->order)
                    ->orderBy('order', 'asc')
                    ->first();

        if (!$adjacent) {
            return self::orderBy('order', 'desc')->first()->order + 1;
        }

        return ($this->order + $adjacent->order) / 2;
    }

    public function beforeOrder(): float | int
    {

        $adjacent = self::where('order', '<', $this->order)
                    ->orderBy('order', 'desc')
                    ->first();

        if (!$adjacent) {
            return self::orderBy('order', 'asc')->first()->order - 1;
        }

        return ($this->order + $adjacent->order) / 2;
    }
}
