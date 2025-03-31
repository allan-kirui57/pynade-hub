<?php

namespace App\Models;

use App\Traits\HasCategories;
use App\Traits\HasTags;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vacancy extends Model
{
    use HasFactory, SoftDeletes, HasTags, HasCategories;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'company',
        'location',
        'vacancy_type',
        'salary_min',
        'salary_max',
        'salary_currency',
        'application_url',
        'user_id',
        'primary_category_id',
        'is_featured',
        'expires_at',
    ];

    protected $casts = [
        'salary_min' => 'integer',
        'salary_max' => 'integer',
        'is_featured' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
