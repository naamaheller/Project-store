<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $viewProducts = Permission::firstOrCreate(['name' => 'view products']);
        $manageProducts = Permission::firstOrCreate(['name' => 'manage products']);

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        $admin->givePermissionTo([$viewProducts, $manageProducts]);
        $user->givePermissionTo([$viewProducts]);

        User::query()->each(function (User $user) {
            if (!$user->hasAnyRole(['admin', 'user'])) {
                $user->assignRole('user');
            }
        });

        $adminUser = User::where('email', 'admin@example.com')->first();
        if ($adminUser) {
            $adminUser->syncRoles(['admin']);
        }

    }
}
