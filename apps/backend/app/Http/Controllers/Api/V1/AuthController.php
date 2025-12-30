<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('web')->accessToken;

        return response()
    ->json([
        'user' => $user,
        'token' => $token,
    ])
    ->cookie(
        'access_token',
        $token,
        60 * 24 * 7,
        '/',
        null,
        false,
        true,
        false,
        'Lax'
    );
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $user->token()) {
            $user->token()->revoke();
        }

        return response()
            ->json(['message' => 'Logged out'])
            ->cookie('access_token', '', -1, '/');
    }
}
