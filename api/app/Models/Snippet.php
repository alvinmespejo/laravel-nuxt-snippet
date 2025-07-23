<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Snippet extends Model
{
    public $guarded = [];

    public static function boot(): void
    {
        parent::boot();
        static::created(function (Snippet $snippet) {
            $snippet->steps()->create(['order' => 1]);
        });
    }

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    /**
     * Undocumented function
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Undocumented function
     *
     * @return boolean
     */
    public function isPublic(): bool
    {
        return $this->is_public ? true : false;
    }

    /**
     * Undocumented function
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_public', true);
    }

    /**
     * Undocumented function
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Undocumented function
     *
     * @return HasMany
     */
    public function steps(): HasMany
    {
        return $this->hasMany(Step::class)->orderBy('order', 'asc');
    }
}
