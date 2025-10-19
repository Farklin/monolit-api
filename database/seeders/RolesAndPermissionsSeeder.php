<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Enum\PermissonEnum;

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
            PermissonEnum::CREATE_USER->value,
            PermissonEnum::READ_USER->value,
            PermissonEnum::UPDATE_USER->value,
            PermissonEnum::DELETE_USER->value,

            // Разрешения
            PermissonEnum::CREATE_PERMISSION->value,
            PermissonEnum::READ_PERMISSION->value,
            PermissonEnum::UPDATE_PERMISSION->value,
            PermissonEnum::DELETE_PERMISSION->value,

            // Проекты
            PermissonEnum::CREATE_PROJECT->value,
            PermissonEnum::READ_PROJECT->value,
            PermissonEnum::UPDATE_PROJECT->value,
            PermissonEnum::DELETE_PROJECT->value,

            // Контексты
            PermissonEnum::READ_CONTEXT->value,
            PermissonEnum::CREATE_CONTEXT->value,
            PermissonEnum::UPDATE_CONTEXT->value,
            PermissonEnum::DELETE_CONTEXT->value,

            // Склады
            PermissonEnum::READ_WAREHOUSE->value,
            PermissonEnum::CREATE_WAREHOUSE->value,
            PermissonEnum::UPDATE_WAREHOUSE->value,
            PermissonEnum::DELETE_WAREHOUSE->value,

            // Остатки на складах
            PermissonEnum::READ_WAREHOUSE_STOCK->value,
            PermissonEnum::CREATE_WAREHOUSE_STOCK->value,
            PermissonEnum::UPDATE_WAREHOUSE_STOCK->value,
            PermissonEnum::DELETE_WAREHOUSE_STOCK->value,

            // Обработка пользователей
            PermissonEnum::HANDLE_USERS_PERMISSIONS->value,
            PermissonEnum::HANDLE_USERS_ROLES->value,

            // Роли
            PermissonEnum::CREATE_ROLE->value,
            PermissonEnum::READ_ROLE->value,
            PermissonEnum::UPDATE_ROLE->value,
            PermissonEnum::DELETE_ROLE->value,

            // Уведомления
            PermissonEnum::SEND_NOTIFICATION->value,
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
            PermissonEnum::READ_PROJECT->value,
            PermissonEnum::CREATE_PROJECT->value,
            PermissonEnum::UPDATE_PROJECT->value,
            PermissonEnum::READ_CONTEXT->value,
            PermissonEnum::CREATE_CONTEXT->value,
            PermissonEnum::UPDATE_CONTEXT->value,
            PermissonEnum::DELETE_CONTEXT->value,
            PermissonEnum::READ_WAREHOUSE->value,
            PermissonEnum::CREATE_WAREHOUSE->value,
            PermissonEnum::UPDATE_WAREHOUSE->value,
            PermissonEnum::DELETE_WAREHOUSE->value,
            PermissonEnum::READ_WAREHOUSE_STOCK->value,
            PermissonEnum::CREATE_WAREHOUSE_STOCK->value,
            PermissonEnum::UPDATE_WAREHOUSE_STOCK->value,
            PermissonEnum::DELETE_WAREHOUSE_STOCK->value,
        ]);

        // Назначение разрешений обычному пользователю
        $userRole->givePermissionTo([
            PermissonEnum::READ_PROJECT->value,
            PermissonEnum::READ_CONTEXT->value,
            PermissonEnum::READ_WAREHOUSE->value,
            PermissonEnum::READ_WAREHOUSE_STOCK->value,
        ]);

        $this->command->info('Роли и разрешения успешно созданы!');
        $this->command->info('Создано ролей: ' . Role::count());
        $this->command->info('Создано разрешений: ' . Permission::count());
    }
}
