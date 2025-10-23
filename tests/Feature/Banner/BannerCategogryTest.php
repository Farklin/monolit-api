<?php

namespace Tests\Feature\Banner;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use App\Models\BannerCategory;
class BannerCategogryTest extends TestCase
{
    use DatabaseMigrations, WithoutMiddleware;
    /**
     * A basic feature test example.
     */
    public function test_get_banner_categories(): void
    {
        $response = $this->get('/api/banner-categories');

        $response->assertStatus(200);
    }

    public function test_create_banner_category(): void
    {
        $response = $this->post('/api/banner-categories', [
            'name' => 'Test Banner Category',
            'context_id' => 1,
            'banner_id' => 1,
            'type' => 'default',
            'category_id' => 1,
            'priority' => 1,
        ]);
        $response->assertStatus(200);
    }

    public function test_update_banner_category(): void
    {
        $bannerCategory = \App\Models\BannerCategory::create([
            'name' => 'Test Banner Category',
            'context_id' => 1,
            'banner_id' => 1,
            'type' => 'default',
            'category_id' => 1,
            'priority' => 1,
        ]);
        $response = $this->put('/api/banner-categories/' . $bannerCategory->id, [
            'name' => 'Updated Banner Category',
            'context_id' => 2,
            'banner_id' => 2,
            'type' => 'mobile',
            'category_id' => 2,
            'priority' => 2,
        ]);
        $response->assertStatus(200);

        $this->assertDatabaseHas('banner_categories', [
            'name' => 'Updated Banner Category',
            'context_id' => 2,
            'banner_id' => 2,
            'type' => 'mobile',
            'category_id' => 2,
            'priority' => 2,
        ]);
    }
}
