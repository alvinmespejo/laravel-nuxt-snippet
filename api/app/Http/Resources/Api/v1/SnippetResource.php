<?php

namespace App\Http\Resources\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class SnippetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'is_public' => $this->is_public,
            'step_counts' => $this->steps()->count(),
            'owner' => $this->user_id === Auth::user()?->id,
            'author' => new UserResource($this->whenLoaded('user')),
            'steps' => StepResource::collection($this->whenLoaded('steps'))
        ];
    }
}
