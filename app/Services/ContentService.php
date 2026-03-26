<?php
// app/Services/ContentService.php

namespace App\Services;

use App\Models\Blog;
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
            'author:id,name,avatar',
            'tags:id,name,slug',
            'comments' => function ($query) {
                $query->count();
            },
            'votes' => function ($query) {
                $query->selectRaw('votable_id, SUM(vote) as vote_sum')
                    ->groupBy('votable_id');
            }
        ]);

        if (!empty($filters['tag_id'])) {
            $query->whereHas('tags', function ($q) use ($filters) {
                $q->where('tags.id', $filters['tag_id']);
            });
        }

        // Add more filters as needed

        return $query->latest('published_at')->paginate($perPage);
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
