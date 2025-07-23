<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\SignupRequest;
use App\Http\Response\ApiErrorResponse;
use App\Http\Response\ApiResponse;
use App\Servicess\Api\v1\UserService;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Response;
use Throwable;

class RegisterController extends Controller
{
    public function __construct(private UserService $service)
    {
    }

    public function register(SignupRequest $request): Responsable
    {
        try {
            $this->service->create($request->safe()->only(['name', 'email', 'password']));
            return new ApiResponse(code: Response::HTTP_NO_CONTENT);
        } catch (Throwable $th) {
            return new ApiErrorResponse($th);
        }
    }
}
