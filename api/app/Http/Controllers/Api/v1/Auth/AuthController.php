<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\SigninRequest;
use App\Http\Response\ApiErrorResponse;
use App\Http\Response\ApiResponse;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\JWT;

class AuthController extends Controller
{
    public function signin(SigninRequest $request): Responsable
    {

        try {
            if (!$token = JWTAuth::attempt($request->only('email', 'password'))) {
                return new ApiResponse(
                    data: 'Invalid Credentials',
                    code: Response::HTTP_UNAUTHORIZED
                );
            }

            return new ApiResponse(
                $this->respondWithToken($token)
            );
        } catch (JWTException $th) {
            return new ApiErrorResponse(
                $th
            );
        }
    }

    public function signout(Request $request): Responsable
    {
        try {
            /** Invalidate and blacklist the token */
            // JWTAuth::invalidate(JWTAuth::getToken(), true, true);
            auth()->logout(true);
            return new ApiResponse(code: Response::HTTP_NO_CONTENT);
        } catch (Throwable $th) {
            return new ApiErrorResponse($th);
        }
    }

    public function refresh(Request $request): ApiResponse
    {
        JWTAuth::invalidate(true);
        $newToken = JWTAuth::fromUser($request->user());
        return new ApiResponse(
            $this->respondWithToken($newToken)
        );
    }

    /**
     * Undocumented function
     *
     * @param Request $request
     * @return ApiResponse
     */
    public function me(Request $request): ApiResponse
    {
        return new ApiResponse(
            $request->user()
        );
    }

    /**
     * Undocumented function
     *
     * @param string $token
     * @param string $type
     * @return ApiResponse
     */
    private function respondWithToken(string $token, string $type = 'Bearer'): array
    {
        return [
            'access_token' => $token,
            'token_type' => $type,
            'expires_in' => JWTAuth::factory()->getTTL() * 60 * 60
        ];
    }
}
