<?php

namespace Database\Factories;

use App\Models\Context;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    public function definition(): array
    {
        return [
            'updated_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'priority' => $this->faker->randomNumber(),
            'status' => $this->faker->boolean(),
            'content' => $this->faker->word(),
            'description' => $this->faker->text(),
            'name' => $this->faker->name(),
            'context_id' => Context::factory(),
        ];
    }
}
