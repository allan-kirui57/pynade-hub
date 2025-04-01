<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
//use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    //HasApiTokens
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'avatar',
        'website',
        'github_url',
        'linkedin_url',
        'twitter_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function vacancies()
    {
        return $this->hasMany(Vacancy::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
