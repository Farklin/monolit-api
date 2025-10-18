<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleTest extends TestCase
{
    use DatabaseMigrations, WithoutMiddleware;
    /**
     * A basic feature test example.
     */
    public function test_get_roles(): void
    {
        $response = $this->get('/api/roles');

        $response->assertStatus(200);
    }

    public function test_get_roles_with_permissions(): void
    {
        // Создаем роль с разрешениями
        $role = Role::create(['name' => 'admin']);
        $permission1 = Permission::create(['name' => 'create users']);
        $permission2 = Permission::create(['name' => 'edit users']);

        $role->givePermissionTo($permission1);
        $role->givePermissionTo($permission2);

        $response = $this->get('/api/roles');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'guard_name',
                'created_at',
                'updated_at',
                'permissions' => [
                    '*' => [
                        'id',
                        'name',
                        'guard_name'
                    ]
                ]
            ]
        ]);

        // Проверяем, что разрешения присутствуют
        $data = $response->json();
        $this->assertCount(2, $data[0]['permissions']);
    }

    public function test_get_role()
    {
        $role = Role::create(['name' => 'test']);
        $response = $this->get('/api/roles/' . $role->id);
        $response->assertStatus(200);
    }

    public function test_get_role_with_permissions()
    {
        // Создаем роль с разрешениями
        $role = Role::create(['name' => 'manager']);
        $permission1 = Permission::create(['name' => 'view reports']);
        $permission2 = Permission::create(['name' => 'export reports']);

        $role->givePermissionTo($permission1);
        $role->givePermissionTo($permission2);

        $response = $this->get('/api/roles/' . $role->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'guard_name',
            'created_at',
            'updated_at',
            'permissions' => [
                '*' => [
                    'id',
                    'name',
                    'guard_name'
                ]
            ]
        ]);

        // Проверяем, что разрешения присутствуют
        $data = $response->json();
        $this->assertCount(2, $data['permissions']);
        $this->assertEquals('view reports', $data['permissions'][0]['name']);
        $this->assertEquals('export reports', $data['permissions'][1]['name']);
    }

    public function test_create_role()
    {
        $response = $this->post('/api/roles', ['name' => 'test']);
        $response->assertStatus(201);
    }

    public function test_add_permission_to_role()
    {
        $role = Role::create(['name' => 'test']);
        $permission = Permission::create(['name' => 'create project']);
        $response = $this->post('/api/roles/permissions/add', ['role_id' => $role->id, 'permission_id' => $permission->id]);
        $response->assertStatus(200);
    }

    public function test_remove_permission_from_role()
    {
        $role = Role::create(['name' => 'test']);
        $permission = Permission::create(['name' => 'create project']);
        $response = $this->delete('/api/roles/permissions/remove', ['role_id' => $role->id, 'permission_id' => $permission->id]);
        $response->assertStatus(200);
    }
}
