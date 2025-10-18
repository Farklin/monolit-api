<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Spatie\Permission\Models\Permission;

class PermissionTest extends TestCase
{
    use DatabaseMigrations, WithoutMiddleware;
    /**
     * A basic feature test example.
     */
    public function test_get_permissions(): void
    {
        $response = $this->get('/api/permissions');
        $response->assertStatus(200);
    }

    public function test_get_permission()
    {
        $permission = Permission::create(['name' => 'create project']);
        $response = $this->get('/api/permissions/' . $permission->id);
        $response->assertStatus(200);
    }

    public function test_create_permission(): void
    {
        $response = $this->post('/api/permissions', ['name' => 'create project']);
        $response->assertStatus(201);
    }

    public function test_update_permission(): void
    {
        $permission = Permission::create(['name' => 'create project']);
        $response = $this->put('/api/permissions/' . $permission->id, data: ['name' => 'update project']);
        $response->assertStatus(200);
    }

    public function test_delete_permission(): void
    {
        $permission = Permission::create(['name' => 'create project']);
        $response = $this->delete('/api/permissions/' . $permission->id);
        $response->assertStatus(200);

        $permission = Permission::first($permission->id);
        if ($permission) {
            self::fail("Ошибка разрешение не удалено");
        }
    }
}
