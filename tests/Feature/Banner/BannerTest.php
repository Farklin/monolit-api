<?php

namespace Tests\Feature\Banner;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BannerTest extends TestCase
{
    use DatabaseMigrations, WithoutMiddleware;
    /**
     * A basic feature test example.
     */
    public function test_get_banners(): void
    {
        $response = $this->get('/api/banners');

        $response->assertJsonIsArray();
        $response->assertStatus(200);
    }

    public function test_upload_banners(): void
    {
        // Создаем тестовые файлы
        $banner1 = UploadedFile::fake()->image('banner1.jpg', 800, 600);
        $banner2 = UploadedFile::fake()->image('banner2.jpg', 1024, 768);

        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner1, $banner2],
            'type' => 'default',
        ]);

        // Проверяем успешный ответ
        $response->assertStatus(200);


        $responseData = $response->json();
        $uploadedImages = $responseData['images'];

        // Проверяем, что вернулись пути к загруженным файлам
        $this->assertCount(2, $uploadedImages);

        // Проверяем, что каждый файл существует в storage
        foreach ($uploadedImages as $imagePath) {
            // Проверяем, что файл существует на public диске
            $this->assertTrue(
                Storage::disk('public')->exists($imagePath),
                "Файл {$imagePath} не найден в storage"
            );

            // Проверяем, что файл не пустой
            $this->assertGreaterThan(
                0,
                Storage::disk('public')->size($imagePath),
                "Файл {$imagePath} пустой"
            );
        }

        // Проверяем, что баннеры сохранились в базе данных
        $banners = \App\Models\Banner::all();
        $this->assertCount(2, $banners);

        // Проверяем, что пути в БД соответствуют загруженным файлам
        foreach ($banners as $banner) {
            $this->assertContains($banner->image, $uploadedImages);
            $this->assertEquals('default', $banner->type);

            // Проверяем, что файл действительно существует по пути из БД
            $this->assertTrue(
                Storage::disk('public')->exists($banner->image),
                "Файл из БД {$banner->image} не найден в storage"
            );
        }

        // Проверяем иерархию баннеров (первый - основной, остальные - дочерние)
        $mainBanner = $banners->where('banner_id', null)->first();
        $childBanners = $banners->where('banner_id', '!=', null);

        $this->assertNotNull($mainBanner, 'Основной баннер не найден');
        $this->assertCount(1, $childBanners, 'Должен быть только один дочерний баннер');

        $childBanner = $childBanners->first();
        $this->assertEquals($mainBanner->id, $childBanner->banner_id);
    }

    public function test_get_banners_with_type_filter(): void
    {
        // Создаем тестовые баннеры разных типов
        $banner1 = UploadedFile::fake()->image('banner1.jpg', 800, 600);
        $banner2 = UploadedFile::fake()->image('banner2.jpg', 1024, 768);
        $banner3 = UploadedFile::fake()->image('banner3.jpg', 1200, 800);

        // Загружаем баннеры разных типов
        $this->post('/api/banners/upload', [
            'banners' => [$banner1],
            'type' => 'mobile',
        ]);

        $this->post('/api/banners/upload', [
            'banners' => [$banner2],
            'type' => 'desktop',
        ]);

        $this->post('/api/banners/upload', [
            'banners' => [$banner3],
            'type' => 'mobile',
        ]);

        // Тестируем фильтрацию по типу mobile
        $response = $this->get('/api/banners?type=mobile');
        $response->assertStatus(200);
        $response->assertJsonIsArray();

        $mobileBanners = $response->json();
        $this->assertCount(2, $mobileBanners);

        foreach ($mobileBanners as $banner) {
            $this->assertEquals('mobile', $banner['type']);
        }

        // Тестируем фильтрацию по типу desktop
        $response = $this->get('/api/banners?type=desktop');
        $response->assertStatus(200);

        $desktopBanners = $response->json();
        $this->assertCount(1, $desktopBanners);
        $this->assertEquals('desktop', $desktopBanners[0]['type']);
    }

    public function test_upload_single_banner(): void
    {
        $banner = UploadedFile::fake()->image('single_banner.jpg', 800, 600);

        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner],
            'type' => 'tablet',
        ]);

        $response->assertStatus(200);

        $responseData = $response->json();
        $this->assertArrayHasKey('message', $responseData);
        $this->assertArrayHasKey('images', $responseData);
        $this->assertCount(1, $responseData['images']);

        // Проверяем, что баннер сохранился в БД
        $banners = \App\Models\Banner::all();
        $this->assertCount(1, $banners);

        $bannerModel = $banners->first();
        $this->assertEquals('tablet', $bannerModel->type);
        $this->assertNull($bannerModel->banner_id); // Одиночный баннер не имеет родителя
    }

    public function test_upload_multiple_banners_different_types(): void
    {
        $banner1 = UploadedFile::fake()->image('banner1.jpg', 800, 600);
        $banner2 = UploadedFile::fake()->image('banner2.jpg', 1024, 768);
        $banner3 = UploadedFile::fake()->image('banner3.jpg', 1200, 800);

        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner1, $banner2, $banner3],
            'type' => 'all',
        ]);

        $response->assertStatus(200);

        $responseData = $response->json();
        $this->assertCount(3, $responseData['images']);

        // Проверяем иерархию баннеров
        $banners = \App\Models\Banner::all();
        $this->assertCount(3, $banners);

        $mainBanner = $banners->where('banner_id', null)->first();
        $childBanners = $banners->where('banner_id', '!=', null);

        $this->assertNotNull($mainBanner);
        $this->assertCount(2, $childBanners);

        // Проверяем, что все дочерние баннеры ссылаются на основной
        foreach ($childBanners as $childBanner) {
            $this->assertEquals($mainBanner->id, $childBanner->banner_id);
            $this->assertEquals('all', $childBanner->type);
        }
    }

    public function test_upload_banners_all_types(): void
    {
        $types = ['default', 'mobile', 'tablet', 'desktop', 'all'];

        foreach ($types as $type) {
            $banner = UploadedFile::fake()->image("banner_{$type}.jpg", 800, 600);

            $response = $this->post('/api/banners/upload', [
                'banners' => [$banner],
                'type' => $type,
            ]);

            $response->assertStatus(200);

            // Проверяем, что баннер сохранился с правильным типом
            $bannerModel = \App\Models\Banner::where('type', $type)->first();
            $this->assertNotNull($bannerModel);
            $this->assertEquals($type, $bannerModel->type);
        }

        // Проверяем общее количество баннеров
        $totalBanners = \App\Models\Banner::count();
        $this->assertEquals(5, $totalBanners);
    }

    public function test_get_banners_empty_result(): void
    {
        $response = $this->get('/api/banners');
        $response->assertStatus(200);
        $response->assertJsonIsArray();
        $response->assertJsonCount(0);
    }

    public function test_get_banners_with_nonexistent_type_filter(): void
    {
        // Создаем баннер
        $banner = UploadedFile::fake()->image('banner.jpg', 800, 600);
        $this->post('/api/banners/upload', [
            'banners' => [$banner],
            'type' => 'default',
        ]);

        // Ищем несуществующий тип
        $response = $this->get('/api/banners?type=nonexistent');
        $response->assertStatus(200);
        $response->assertJsonIsArray();
        $response->assertJsonCount(0);
    }

    public function test_banner_storage_structure(): void
    {
        $banner = UploadedFile::fake()->image('test_banner.jpg', 800, 600);

        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner],
            'type' => 'default',
        ]);

        $response->assertStatus(200);

        $responseData = $response->json();
        $imagePath = $responseData['images'][0];

        // Проверяем, что путь начинается с 'banners/'
        $this->assertStringStartsWith('banners/', $imagePath);

        // Проверяем, что файл существует
        $this->assertTrue(Storage::disk('public')->exists($imagePath));

        // Проверяем, что это действительно изображение
        $this->assertTrue(in_array(pathinfo($imagePath, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif', 'svg']));
    }

    public function test_banner_model_relationships(): void
    {
        $banner1 = UploadedFile::fake()->image('parent_banner.jpg', 800, 600);
        $banner2 = UploadedFile::fake()->image('child_banner.jpg', 1024, 768);

        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner1, $banner2],
            'type' => 'default',
        ]);

        $response->assertStatus(200);

        $banners = \App\Models\Banner::all();
        $mainBanner = $banners->where('banner_id', null)->first();
        $childBanner = $banners->where('banner_id', '!=', null)->first();

        // Проверяем, что дочерний баннер ссылается на основной
        $this->assertEquals($mainBanner->id, $childBanner->banner_id);

        // Проверяем, что оба баннера имеют одинаковый тип
        $this->assertEquals($mainBanner->type, $childBanner->type);
        $this->assertEquals('default', $mainBanner->type);
    }

    public function test_get_banner_by_id(): void
    {
        $banner = UploadedFile::fake()->image('test_banner.jpg', 800, 600);
        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner],
            'type' => 'default',
        ]);
        $response->assertStatus(200);

        $banner = \App\Models\Banner::first();
        $response = $this->get('/api/banners/' . $banner->id);
        $response->assertStatus(200);
        $response->assertJson([
            'id' => $banner->id,
        ]);
    }

    public function test_delete_banner(): void
    {
        $banner = UploadedFile::fake()->image('test_banner.jpg', 800, 600);
        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner],
            'type' => 'default',
        ]);
        $response->assertStatus(200);

        $banner = \App\Models\Banner::first();
        $response = $this->delete('/api/banners/' . $banner->id);
        $response->assertStatus(200);

        $this->assertNull(\App\Models\Banner::find($banner->id));
    }

    public function test_update_banner(): void{
        $banner = UploadedFile::fake()->image('test_banner.jpg', 800, 600);
        $response = $this->post('/api/banners/upload', [
            'banners' => [$banner],
            'type' => 'default',
        ]);
        $response->assertStatus(200);

        $banner = \App\Models\Banner::first();
        $response = $this->put('/api/banners/' . $banner->id, [
            'image' => UploadedFile::fake()->image('test_banner.jpg', 800, 600),
            'type' => 'mobile',
            'banner_id' => $banner->id,
        ]);

        $image = $response->json()['banner']['image'];
        $this->assertTrue(Storage::disk('public')->exists($image));

        $response->assertStatus(200);

    }
}
