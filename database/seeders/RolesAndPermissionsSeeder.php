<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Сброс кэша разрешений
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Удаляем старые роли и разрешения с guard 'web'
        Role::where('guard_name', 'web')->delete();
        Permission::where('guard_name', 'web')->delete();

        // Создание разрешений
        $permissions = [
            // Пользователи
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Роли
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'manage role permissions',

            // Разрешения
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',

            // Проекты
            'view projects',
            'create projects',
            'edit projects',
            'delete projects',

            // Контексты
            'view contexts',
            'create contexts',
            'edit contexts',
            'delete contexts',

            // Склады
            'view warehouses',
            'create warehouses',
            'edit warehouses',
            'delete warehouses',

            // Остатки на складах
            'view warehouse stocks',
            'create warehouse stocks',
            'edit warehouse stocks',
            'delete warehouse stocks',

            // Обработка пользователей
            'handle users roles',
            'handle users permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'sanctum'
            ]);
        }

        // Создание ролей
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'sanctum'
        ]);
        $managerRole = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'sanctum'
        ]);
        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => 'sanctum'
        ]);

        // Назначение всех разрешений администратору
        $adminRole->givePermissionTo(Permission::all());

        // Назначение разрешений менеджеру
        $managerRole->givePermissionTo([
            'view users',
            'view projects',
            'create projects',
            'edit projects',
            'view contexts',
            'create contexts',
            'edit contexts',
            'view warehouses',
            'create warehouses',
            'edit warehouses',
            'view warehouse stocks',
            'create warehouse stocks',
            'edit warehouse stocks',
        ]);

        // Назначение разрешений обычному пользователю
        $userRole->givePermissionTo([
            'view projects',
            'view contexts',
            'view warehouses',
            'view warehouse stocks',
        ]);

        $this->command->info('Роли и разрешения успешно созданы!');
        $this->command->info('Создано ролей: ' . Role::count());
        $this->command->info('Создано разрешений: ' . Permission::count());
    }
}
