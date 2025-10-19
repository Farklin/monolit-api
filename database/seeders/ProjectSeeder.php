<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Context;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Faker\Factory as Faker;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        Project::factory()->count(count: 4)->create();

        $projects = Project::all();
        foreach ($projects as $project) {
            Context::factory()->count(count: 4)->create(attributes: [
                'project_id' => $project->id,
            ]);

            // Получаем только контексты текущего проекта
            $contexts = Context::where('project_id', $project->id)->get();
            foreach ($contexts as $context) {
                Warehouse::factory()->count(count: 4)->create([
                    'context_id' => $context->id,
                ]);

                // Получаем только склады текущего контекста
                $warehouses = Warehouse::where('context_id', $context->id)->get();
                foreach ($warehouses as $warehouse) {
                    // Создаем 4 записи с уникальными category_id для каждого склада
                    for ($i = 1; $i <= 4; $i++) {
                        WarehouseStock::factory()->create([
                            'warehouse_id' => $warehouse->id,
                            'category_id' => $i, // Используем последовательные ID
                            'max_quantity' => $faker->numberBetween(100, 1000),
                            'min_quantity' => $faker->numberBetween(0, 100),
                        ]);
                    }
                }
            }
        }
    }
}
