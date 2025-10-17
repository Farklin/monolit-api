<?php

namespace Tests\Feature;

use App\Models\Context;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class ContextTest extends TestCase
{
    use DatabaseMigrations;

    public function test_get_contexts()
    {
        $response = $this->get('/api/contexts');

        $response->assertStatus(200)->assertJsonIsArray();
    }

    public function test_get_context()
    {
        $context = Context::factory()->create();

        $response = $this->get('/api/contexts/' . $context->id);
        $response->assertStatus(200)->assertJsonStructure(['id', 'name', 'status', 'priority', 'key']);
    }

    public function test_create_context()
    {
        $data = Context::factory()->make()->toArray();

        $response = $this->post('/api/contexts/', $data);

        $response->assertStatus(201);
    }

    public function test_update_context()
    {
        $context  = Context::factory()->create();
        $data = Context::factory()->make()->toArray();

        $response = $this->put('/api/contexts/' . $context->id, $data);

        $responseGet = $this->get('/api/contexts/' . $context->id);
        $responseGet->assertJsonFragment($data);
    }

    public function test_delete_context()
    {
        $context  = Context::factory()->create();
        $response = $this->delete('/api/contexts/' . $context->id);
        $response->assertStatus(200);

        $context = Context::first($context->id);
        if($context){
            self::fail("Ошибка контекст не удален");
        }
    }
}
