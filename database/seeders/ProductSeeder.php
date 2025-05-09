<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all users and categories to assign random IDs
        $userIds = User::pluck('id')->toArray();
        $categoryIds = Category::pluck('id')->toArray();

        // Check if we have users and categories
        if (empty($userIds)) {
            // Create a default user if none exists
            $user = User::factory()->create();
            $userIds = [$user->id];
        }

        if (empty($categoryIds)) {
            // Create some default categories if none exist
            $categories = [
                'Web Development',
                'Mobile Development',
                'AI & Machine Learning',
                'DevOps',
                'Design Tools'
            ];

            foreach ($categories as $category) {
                Category::create([
                    'name' => $category,
                    'slug' => Str::slug($category),
                    'module' => 'product',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            $categoryIds = Category::pluck('id')->toArray();
        }

        // Sample product data
        $products = [
            [
                'name' => 'Laravel Nova',
                'description' => 'Laravel Nova is a beautifully designed administration panel for Laravel. Carefully crafted by the creators of Laravel to make you the most productive developer in the galaxy.',
                'pricing_type' => 'Free',
                'is_open_source' => false,
                'website_url' => 'https://nova.laravel.com',
                'stars_count' => null,
                'is_featured' => true,
            ],
            [
                'name' => 'Tailwind CSS',
                'description' => 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
                'pricing_type' => 'Free',
                'is_open_source' => true,
                'repo_url' => 'https://github.com/tailwindlabs/tailwindcss',
                'website_url' => 'https://tailwindcss.com',
                'stars_count' => 67500,
                'is_featured' => true,
            ],
            [
                'name' => 'Vue.js',
                'description' => 'An approachable, performant and versatile framework for building web user interfaces.',
                'pricing_type' => 'Free',
                'is_open_source' => true,
                'repo_url' => 'https://github.com/vuejs/vue',
                'website_url' => 'https://vuejs.org',
                'stars_count' => 203000,
                'is_featured' => true,
            ],
            [
                'name' => 'Livewire',
                'description' => 'Livewire is a full-stack framework for Laravel that makes building dynamic interfaces simple, without leaving the comfort of Laravel.',
                'pricing_type' => 'Free',
                'is_open_source' => true,
                'repo_url' => 'https://github.com/livewire/livewire',
                'website_url' => 'https://laravel-livewire.com',
                'stars_count' => 19800,
                'is_featured' => false,
            ],
            [
                'name' => 'Alpine.js',
                'description' => 'Alpine.js offers you the reactive and declarative nature of big frameworks like Vue or React at a much lower cost.',
                'pricing_type' => 'Free',
                'is_open_source' => true,
                'repo_url' => 'https://github.com/alpinejs/alpine',
                'website_url' => 'https://alpinejs.dev',
                'stars_count' => 23700,
                'is_featured' => false,
            ],
            [
                'name' => 'Laravel Forge',
                'description' => "Instant PHP Servers. Server management doesn't have to be a nightmare. Provision and deploy unlimited PHP applications on DigitalOcean, Linode, and more.",
                'pricing_type' => 'Free',
                'is_open_source' => false,
                'website_url' => 'https://forge.laravel.com',
                'stars_count' => null,
                'is_featured' => true,
            ],
            [
                'name' => 'React',
                'description' => 'A JavaScript library for building user interfaces. React makes it painless to create interactive UIs.',
                'pricing_type' => 'Free',
                'is_open_source' => true,
                'repo_url' => 'https://github.com/facebook/react',
                'website_url' => 'https://reactjs.org',
                'stars_count' => 192000,
                'is_featured' => true,
            ],
            [
                'name' => 'Next.js',
                'description' => 'The React Framework for Production. Next.js gives you the best developer experience with all the features you need for production.',
                'pricing_type' => 'Free',
                'is_open_source' => true,
                'repo_url' => 'https://github.com/vercel/next.js',
                'website_url' => 'https://nextjs.org',
                'stars_count' => 89700,
                'is_featured' => false,
            ],
            [
                'name' => 'Inertia.js',
                'description' => 'The Modern Monolith. Inertia.js lets you quickly build modern single-page React, Vue and Svelte apps using classic server-side routing and controllers.',
                'pricing_type' => 'Free',
                'is_open_source' => true,
                'repo_url' => 'https://github.com/inertiajs/inertia',
                'website_url' => 'https://inertiajs.com',
                'stars_count' => 16400,
                'is_featured' => false,
            ],
            [
                'name' => 'Laravel Vapor',
                'description' => 'Laravel Vapor is a serverless deployment platform for Laravel, powered by AWS. Launch your Laravel infrastructure on Vapor and fall in love with the scalable simplicity of serverless.',
                'pricing_type' => 'Free',
                'is_open_source' => false,
                'website_url' => 'https://vapor.laravel.com',
                'stars_count' => null,
                'is_featured' => true,
            ]
        ];

        // Create the products
        foreach ($products as $key => $productData) {
            $name = $productData['name'];
            $pricingTypes = ['Free', 'Freemium', 'Paid'];

            Product::create([
                'name' => $name,
                'slug' => Str::slug($name). $key,
                'description' => $productData['description'],
                'image' => $faker->imageUrl(640, 480, null, true),  // Generates a random image URL
                'user_id' => $faker->randomElement($userIds),
                'primary_category_id' => $faker->randomElement($categoryIds),
                'pricing_type' => $faker->randomElement($pricingTypes),
                'is_open_source' => $productData['is_open_source'],
                'repo_url' => $productData['is_open_source'] ? $productData['repo_url'] : null,
                'website_url' => $productData['website_url'],
                'stars_count' => $productData['is_open_source'] ? $productData['stars_count'] : null,
                'is_featured' => $productData['is_featured'],
            ]);
        }

        // Create additional random products
//        for ($i = 0; $i < 20; $i++) {
//            $name = $faker->unique()->words(rand(1, 3), true);
//            $isOpenSource = $faker->boolean(70);  // 70% will be open source
//            $pricingTypes = ['Free', 'Freemium', 'Paid'];
//
//            Product::create([
//                'name' => ucwords($name),
//                'slug' => Str::slug($name) .' '. $i,
//                'description' => $faker->paragraph(3),
//                'image' => $faker->imageUrl(640, 480, null, true),
//                'user_id' => $faker->randomElement($userIds),
//                'category_id' => $faker->randomElement($categoryIds),
//                'pricing_type' => $faker->randomElement($pricingTypes),
//                'is_open_source' => $isOpenSource,
//                'repo_url' => $isOpenSource ? 'https://github.com/' . $faker->userName . '/' . Str::slug($name) : null,
//                'website_url' => $faker->boolean(80) ? 'https://' . Str::slug($name) . '.com' : null,
//                'stars_count' => $isOpenSource ? $faker->numberBetween(0, 50000) : null,
//                'is_featured' => $faker->boolean(20),  // 20% will be featured
//                'created_at' => Carbon::now(),
//                'updated_at' => Carbon::now()
//            ]);
//        }
    }
}
