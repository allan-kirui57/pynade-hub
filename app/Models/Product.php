<?php
// app/Models/Product.php

namespace App\Models;

use App\Traits\HasTags;
use App\Traits\HasCategories;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasTags, HasCategories;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'user_id',
        'primary_category_id',
        'pricing_type',
        'is_open_source',
        'repo_url',
        'website_url',
        'stars_count',
        'forks_count',
        'watchers_count',
        'last_synced_at',
        'is_featured',
    ];

    protected $casts = [
        'is_open_source' => 'boolean',
        'stars_count' => 'integer',
        'forks_count' => 'integer',
        'watchers_count' => 'integer',
        'is_featured' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }
    public function relatedProducts()
    {
        return $this->where('category_id', $this->category_id)
            ->where('id', '!=', $this->id)
            ->take(3)
            ->get();
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
