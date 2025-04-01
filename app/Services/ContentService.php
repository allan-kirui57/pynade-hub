<?php
// app/Services/ContentService.php

namespace App\Services;

use App\Models\Blog;
use App\Models\Product;
use App\Models\Job;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ContentService
{
    /**
     * Get paginated blogs with proper eager loading.
     */
    public function getPaginatedBlogs(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Blog::with([
            'user:id,name,avatar',
            'primaryCategory:id,name,slug',
            'tags:id,name,slug',
            'comments' => function ($query) {
                $query->count();
            },
            'votes' => function ($query) {
                $query->selectRaw('votable_id, SUM(vote) as vote_sum')
                    ->groupBy('votable_id');
            }
        ]);

        // Apply filters
        if (!empty($filters['category_id'])) {
            $query->whereHas('categories', function ($q) use ($filters) {
                $q->where('categories.id', $filters['category_id']);
            });
        }

        if (!empty($filters['tag_id'])) {
            $query->whereHas('tags', function ($q) use ($filters) {
                $q->where('tags.id', $filters['tag_id']);
            });
        }

        // Add more filters as needed

        return $query->latest('published_at')->paginate($perPage);
    }

    /**
     * Similar methods for products and jobs
     */

    /**
     * Get categories with counts for a specific module.
     */
    public function getCategoriesWithCounts(string $module): array
    {
        $cacheKey = "categories_with_counts_{$module}";

        return Cache::remember($cacheKey, now()->addHours(6), function () use ($module) {
            $categories = Category::forModule($module)->active()->get();

            foreach ($categories as $category) {
                switch ($module) {
                    case 'blog':
                        $category->count = $category->blogs()->count();
                        break;
                    case 'product':
                        $category->count = $category->products()->count();
                        break;
                    case 'job':
                        $category->count = $category->vacancies()->count();
                        break;
                }
            }

            return $categories->toArray();
        });
    }

    /**
     * Get popular tags for a module.
     */
    public function getPopularTags(string $module, int $limit = 10): array
    {
        $cacheKey = "popular_tags_{$module}_{$limit}";

        return Cache::remember($cacheKey, now()->addHours(6), function () use ($module, $limit) {
            return Tag::getPopularTags($module, $limit)->toArray();
        });
    }
}
