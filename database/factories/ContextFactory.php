<?php

namespace Database\Factories;

use App\Models\Context;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ContextFactory extends Factory
{
    protected $model = Context::class;

    public function definition()
    {
        return [
            'updated_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'priority' => $this->faker->randomNumber(),
            'status' => $this->faker->boolean(),
            'description' => $this->faker->text(),
            'key' => $this->faker->word(),
            'name' => $this->faker->name(),
            'project_id' => Project::factory(),
        ];
    }
}
