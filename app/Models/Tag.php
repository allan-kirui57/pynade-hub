<?php
// app/Models/Tag.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'group',
        'description',
    ];

    /**
     * Get all blogs with this tag.
     */
    public function blogs()
    {
        return $this->morphedByMany(Blog::class, 'taggable');
    }

    /**
     * Get all products with this tag.
     */
    public function products()
    {
        return $this->morphedByMany(Product::class, 'taggable');
    }

    /**
     * Get all vacancies with this tag.
     */
    public function vacancies()
    {
        return $this->morphedByMany(Vacancy::class, 'taggable');
    }

    /**
     * Scope a query to only include tags from a specific group.
     */
    public function scopeInGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }

    /**
     * Get popular tags with usage count.
     */
    public static function getPopularTags(string $group = null, int $limit = 10)
    {
        $query = self::withCount(['blogs', 'products', 'vacancies'])
            ->orderByRaw('blogs_count + products_count + vacancies_count DESC')
            ->limit($limit);

        if ($group) {
            $query->where('group', $group);
        }

        return $query->get();
    }
}
