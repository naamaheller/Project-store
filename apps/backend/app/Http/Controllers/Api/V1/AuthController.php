<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Throwable;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            $user = User::where('email', $data['email'])->first();

            if (!$user || !Hash::check($data['password'], $user->password)) {
                return response()->json([
                    'message' => 'Invalid credentials',
                ], 401);
            }

            $token = $user->createToken('api')->accessToken;

            return response()
                ->json([
                    'user' => $user->only([
                        'id',
                        'name',
                        'email',
                        'role',
                        'created_at',
                        'updated_at',
                    ]),
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
                );

        } catch (Throwable $th) {
            return response()->json([
                'message' => 'Server error',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => ['required', 'string', 'min:6'],
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'] ?? 'USER',
            ]);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user->only(['id', 'name', 'email', 'role', 'created_at', 'updated_at']),
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Throwable $th) {
            report($th);
            return response()->json(['message' => 'Server error'], 500);
        }
    }


    public function me(Request $request)
    {
        try {
            $user = $request->user('api');

            if (!$user) {
                return response()->json([
                    'message' => 'Unauthenticated',
                ], 401);
            }

            return response()->json([
                'user' => $user->only([
                    'id',
                    'name',
                    'email',
                    'role',
                    'created_at',
                    'updated_at',
                ]),
            ]);

        } catch (Throwable $th) {
            return response()->json([
                'message' => 'Server error',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user('api');

            if ($user && $user->token()) {
                $user->token()->revoke();
            }

            return response()
                ->json(['message' => 'Logged out'])
                ->cookie('access_token', '', -1, '/');

        } catch (Throwable $th) {
            return response()->json([
                'message' => 'Server error',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
