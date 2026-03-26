<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $blogs = Blog::with([
            'author:id,name,avatar',
            'tags:id,name,slug',
        ])
            ->latest('published_at')
            ->take(3)
            ->get();

        $featuredProducts = Product::where('is_featured', true)
            ->take(3)
            ->get();

        return Inertia::render('frontend/Index', [
            'blogs' => $blogs,
            'products' => $featuredProducts,
        ]);
    }
}
