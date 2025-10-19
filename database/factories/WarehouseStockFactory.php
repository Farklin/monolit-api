<?php

namespace Database\Factories;

use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class WarehouseStockFactory extends Factory
{
    protected $model = WarehouseStock::class;

    public function definition(): array
    {
        return [
            'updated_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'min_quantity' => $this->faker->numberBetween(0, 100),
            'max_quantity' => $this->faker->numberBetween(100, 1000),
            'category_id' => $this->faker->numberBetween(1, 10), // Ограничиваем диапазон для избежания конфликтов
            'warehouse_id' => Warehouse::factory(),
        ];
    }
}
