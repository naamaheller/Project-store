<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Login and create access token.
     *
     * @throws ValidationException
     */
    public function login(string $email, string $password): array
    {
        /** @var User|null $user */
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Incorrect email or password'],
            ]);
        }

        $token = $user->createToken('api')->accessToken;

        $role = $user->role;
        $token = $user->createToken('api', [$role])->accessToken;
        return [$user, $token];
    }

    /**
     * Register user (role optional).
     *
     * @throws ValidationException
     */
    public function register(array $data): User
    {
        // הגנה נוספת על unique (מעבר ל-validation)
        if (User::where('email', $data['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => ['Email already exists'],
            ]);
        }

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function logout(?User $user): void
    {
        if ($user && method_exists($user, 'token') && $user->token()) {
            $user->token()->revoke();
        }
    }

    public function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),        
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
