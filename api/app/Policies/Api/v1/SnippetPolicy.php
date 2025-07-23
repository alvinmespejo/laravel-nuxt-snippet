<?php

namespace App\Policies\Api\v1;

use App\Models\Snippet;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class SnippetPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Snippet $snippet): bool
    {
        if ($snippet->isPublic()) {
            return true;
        }

        if ($user->id === $snippet->user_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Snippet $snippet): bool
    {
        return $user->id === $snippet->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Snippet $snippet): bool
    {
        return $user->id === $snippet->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Snippet $snippet): bool
    {
        return $user->id === $snippet->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Snippet $snippet): bool
    {
        return $user->id === $snippet->user_id;
    }
}
