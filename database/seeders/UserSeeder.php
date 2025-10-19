<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@mlt-it.ru',
            'password' => Hash::make('admin'),
        ]);
        $user->assignRole('admin');

        $user = User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@mlt-it.ru',
            'password' => Hash::make('manager'),
        ]);
        $user->assignRole('manager');

        $user = User::factory()->create([
            'name' => 'User',
            'email' => 'user@mlt-it.ru',
            'password' => Hash::make('user'),
        ]);
        $user->assignRole('user');
    }
}
