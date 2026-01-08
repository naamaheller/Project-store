<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    public function login(Request $request)
    {

        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        [$user, $token] = $this->authService->login($data['email'], $data['password']);


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
                false,
                false,
                'Lax'
            );


    }

    public function register(Request $request)
    {

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


    }

    public function me(Request $request)
    {

        $user = $request->user('api');

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'user' => $this->authService->userPayload($user),
        ]);


    }

    public function logout(Request $request)
    {

        $user = $request->user('api');
        $this->authService->logout($user);

        return response()
            ->json(['message' => 'Logged out'])
            ->cookie('access_token', '', -1, '/')
            ->cookie('role', '', -1, '/');
    }
}
