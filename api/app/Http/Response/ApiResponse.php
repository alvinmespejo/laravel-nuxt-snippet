<?php

namespace App\Http\Response;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;

class ApiResponse implements Responsable
{
    public function __construct(
        protected mixed $data = [],
        protected array $metadata = [],
        protected int $code = Response::HTTP_OK,
        protected array $headers = []
    ) {

    }

    public function toResponse($request)
    {
        $response = [];
        $response = is_null(JsonResource::$wrap)
            ? $this->data
            : ['data' => $this->data];

        if ($this->metadata) {
            $response['metadata'] = $this->metadata;
        }

        return response()->json(
            $response,
            $this->code,
            $this->headers
        );
    }
}
