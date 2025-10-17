<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use OpenApi\Attributes\Post;
use Tests\TestCase;
use App\Models\Project;

class ProjectTest extends TestCase
{
    use DatabaseMigrations, WithFaker;
    /**
     * A basic feature test example.
     */
    public function test_get_projects(): void
    {
        $response = $this->get('/api/projects');

        $response->assertStatus(200);
    }

    public function test_get_project()
    {
        $project = Project::factory()->create();

        $response = $this->get('/api/projects/' . $project->id);

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name', 'status', 'priority', 'key']);
    }


    public function test_create_project()
    {
        $response = $this->post("/api/projects", [
            "priority" => 1,
            "status" => $this->faker()->boolean(),
            "name" => $this->faker()->title(),
            "key" => $this->faker()->slug(),
        ]);
        $response->assertStatus(201);
    }

    public function test_update_project()
    {
        $project = Project::factory()->create();

        $response = $this->put("/api/projects/" . $project->id, [
            "priority" => 1,
            "status" => $this->faker()->boolean(),
            "name" => $this->faker()->title(),
            "key" => $this->faker()->slug(),
        ]);
        $response->assertStatus(200);
    }

    public function test_delete()
    {
        $project = Project::factory()->create();

        $response = $this->delete("/api/projects/" . $project->id);
        $response->assertStatus(200);
    }
}
