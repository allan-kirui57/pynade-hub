<?php
// app/Http/Controllers/Public/BlogController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use App\Services\ContentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    protected $contentService;

    public function __construct(ContentService $contentService)
    {
        $this->contentService = $contentService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['category', 'tag', 'search']);

        $blogs = $this->contentService->getPaginatedBlogs($filters);

        $categories = $this->contentService->getCategoriesWithCounts('blog');
        $popularTags = $this->contentService->getPopularTags('blog');

        return Inertia::render('frontend/blogs', [
            'blogs' => $blogs,
            'categories' => $categories,
            'popularTags' => $popularTags,
            'filters' => $filters,
        ]);
    }

    public function show(Blog $blog)
    {
        $blog->load([
            'user:id,name,avatar,bio',
            'categories:id,name,slug',
            'tags:id,name,slug',
            'comments' => function ($query) {
                $query->with('user:id,name,avatar')
                    ->whereNull('parent_id')
                    ->latest();
            },
            'comments.replies' => function ($query) {
                $query->with('user:id,name,avatar')->latest();
            }
        ]);

        // Increment view count or track analytics here

        // Get related blogs
        $relatedBlogs = Blog::where('id', '!=', $blog->id)
            ->where(function ($query) use ($blog) {
                $query->where('primary_category_id', $blog->primary_category_id)
                    ->orWhereHas('tags', function ($q) use ($blog) {
                        $q->whereIn('tags.id', $blog->tags->pluck('id'));
                    });
            })
            ->with('user:id,name', 'primaryCategory:id,name')
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/Blogs/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }
}
