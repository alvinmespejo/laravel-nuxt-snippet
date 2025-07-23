<?php

namespace App\Http\Response;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Throwable;

class ApiErrorResponse implements Responsable
{
    public function __construct(
        protected Throwable $e,
        protected string $message = 'An error occured while processing request. Please try again.',
        protected int $code = Response::HTTP_INTERNAL_SERVER_ERROR,
        protected array $headers = []
    ) {
        Log::error('API ERROR', [$e]);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request): \Symfony\Component\HttpFoundation\Response
    {
        if ($this->e && config('app.debug')) {
            return response()->json(
                [
                    'message' => $this->message,
                    'error' => [
                        'line' => $this->e->getLine(),
                        'file' => $this->e->getFile(),
                        'message' => $this->e->getMessage()
                    ]
                ],
                $this->code,
                $this->headers
            );
        }

        return response()->json(
            ['error' => $this->message],
            $this->code,
            $this->headers
        );
    }
}
