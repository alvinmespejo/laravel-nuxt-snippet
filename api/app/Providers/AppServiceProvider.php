<?php

namespace App\Providers;

use App\Models\Snippet;
use App\Policies\Api\v1\SnippetPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Option 1: Manual policy registration
        // Gate::policy(Snippet::class, SnippetPolicy::class);

        // Option 2
        Gate::guessPolicyNamesUsing(function (string $model) {
            return "App\\Policies\\Api\\v1\\". class_basename($model) ."Policy";
        });
    }
}
