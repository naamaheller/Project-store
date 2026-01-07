<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use App\Services\AuthService;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Throwable;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            [$user, $token] = $this->authService->login($data['email'], $data['password']);

            // dd($user, $token);

            return response()
                ->json([
                    'user' => $this->authService->userPayload($user),
                ])
                ->cookie(
                    'access_token',
                    $token,
                    60 * 24 * 2,
                    '/',
                    null,
                    false,
                    true,
                    false,
                    'Lax'
                )
                ->cookie(
                    'role',
                    $user->getRoleNames()->first(), 
                    60 * 24 * 2,
                    '/',
                    null,
                    false,
                    true, 
                    false,
                    'Lax'
                );

        } catch (ValidationException $e) {
            return response()->json([
                'message' => collect($e->errors())->flatten()->first() ?? 'Incorrect email or password',
                'errors' => $e->errors(),
            ], 401);

        } catch (Throwable $th) {
            report($th);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function register(Request $request)
    {
        try {
            $data = $request->validate(
                [
                    'name' => ['required', 'string', 'max:255'],
                    'email' => ['required', 'email', 'unique:users,email'],
                    'password' => ['required', 'string', 'min:6'],
                ],
                [
                    'email.unique' => 'The email already exists.',
                ]
            );

            $user = $this->authService->register($data);
            $user->assignRole('user');

            try {
                Mail::to($user->email)->send(new WelcomeMail($user));
            } catch (Throwable $e) {
                report($e);
            }
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $this->authService->userPayload($user),
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => collect($e->errors())->flatten()->first() ?? 'Validation error',
                'errors' => $e->errors(),
            ], 422);

        } catch (QueryException $e) {
            // MySQL duplicate entry (race condition) => error code 1062
            if (($e->errorInfo[1] ?? null) == 1062) {
                return response()->json([
                    'message' => 'The email already exists.',
                    'errors' => [
                        'email' => ['The email already exists.'],
                    ],
                ], 422);
            }

            report($e);
            return response()->json(['message' => 'Server error'], 500);

        } catch (Throwable $th) {
            report($th);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = $request->user('api');

            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            return response()->json([
                'user' => $this->authService->userPayload($user),
            ]);

        } catch (Throwable $th) {
            report($th);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user('api');
            $this->authService->logout($user);

            return response()
                ->json(['message' => 'Logged out'])
                ->cookie('access_token', '', -1, '/')
                ->cookie('role', '', -1, '/');

        } catch (Throwable $th) {
            report($th);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}
