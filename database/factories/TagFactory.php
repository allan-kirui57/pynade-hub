<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TagFactory extends Factory
{
    public function definition()
    {
        $tag = $this->faker->unique()->word();

        return [
            'name' => ucfirst($tag),
            'slug' => Str::slug($tag),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
