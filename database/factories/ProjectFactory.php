<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'updated_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'priority' => $this->faker->randomNumber(),
            'status' => $this->faker->boolean(),
            'description' => $this->faker->text(),
            'key' => $this->faker->unique()->word(),
            'name' => $this->faker->name(),
        ];
    }
}
