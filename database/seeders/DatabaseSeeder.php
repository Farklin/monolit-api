<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Сначала создаем роли и разрешения
        $this->call([
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            ProjectSeeder::class,
        ]);

        // User::factory(10)->create();


    }
}
