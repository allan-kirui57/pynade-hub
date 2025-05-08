<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagsSeeder extends Seeder
{
    public function run()
    {
        $commonTags = [
            'Technology',
            'Programming',
            'Web Development',
            'Mobile Development',
            'JavaScript',
            'Python',
            'PHP',
            'Laravel',
            'React',
            'Vue.js',
            'Node.js',
            'DevOps',
            'Cloud Computing',
            'AI & Machine Learning',
            'Data Science',
            'Cybersecurity',
            'UI/UX Design',
            'Career Advice',
            'Productivity',
            'Remote Work'
        ];

        foreach ($commonTags as $tagName) {
            Tag::updateOrCreate(
                ['name' => $tagName],
                ['slug' => Str::slug($tagName)]
            );
        }

        // Create additional random tags
        Tag::factory()->count(15)->create();
    }
}
