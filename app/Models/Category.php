<?php
// app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'module',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the parent category.
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories.
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get all blogs in this category.
     */
    public function blogs()
    {
        return $this->morphedByMany(Blog::class, 'categorizable');
    }

    /**
     * Get all products in this category.
     */
    public function products()
    {
        return $this->morphedByMany(Product::class, 'categorizable');
    }

    /**
     * Get all jobs in this category.
     */
    public function vacancies()
    {
        return $this->morphedByMany(Vacancy::class, 'categorizable');
    }

    /**
     * Scope a query to only include categories for a specific module.
     */
    public function scopeForModule(Builder $query, string $module): Builder
    {
        return $query->where('module', $module);
    }

    /**
     * Scope a query to only include active categories.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Get all categories for a module with caching.
     */
    public static function getCachedForModule(string $module, bool $activeOnly = true)
    {
        $cacheKey = "categories_{$module}_" . ($activeOnly ? 'active' : 'all');

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($module, $activeOnly) {
            $query = self::forModule($module);

            if ($activeOnly) {
                $query->active();
            }

            return $query->orderBy('name')->get();
        });
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Clear cache when categories are modified
        static::saved(function ($category) {
            Cache::forget("categories_{$category->module}_active");
            Cache::forget("categories_{$category->module}_all");
        });

        static::deleted(function ($category) {
            Cache::forget("categories_{$category->module}_active");
            Cache::forget("categories_{$category->module}_all");
        });
    }
}
