<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing categories to avoid duplicate entries
        DB::table('categories')->truncate();

        // Insert the categories
        $categories = [
            ['id' => 1, 'name' => 'Technology', 'slug'=>'technology', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Business', 'slug'=>'business', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Health', 'slug'=>'health', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Lifestyle', 'slug'=>'lifestyle', 'created_at' => now(), 'updated_at' => now()],
        ];

        Category::insert($categories);
    }
}
