<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Permissions
        $viewProducts = Permission::firstOrCreate(['name' => 'view products']);
        $manageProducts = Permission::firstOrCreate(['name' => 'manage products']);

        // Roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // Attach permissions
        $admin->givePermissionTo([$viewProducts, $manageProducts]);
        $user->givePermissionTo([$viewProducts]);

        User::query()->each(function (User $user) {
            if (!$user->hasAnyRole(['admin', 'user'])) {
                $user->assignRole('user');
            }
        });

        $adminUser  = User::where('email', 'admin@example.com')->first();
        if ($adminUser ) {
            $adminUser ->syncRoles(['admin']);
        }
        
    }
}
