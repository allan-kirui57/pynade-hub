<?php
// app/Http/Controllers/Public/BlogController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Blog;
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
        $filters = $request->only(['tag', 'search']);

        $blogs = $this->contentService->getPaginatedBlogs($filters);

        $popularTags = $this->contentService->getPopularTags('blog');

        return Inertia::render('frontend/blogs/index', [
            'blogs' => $blogs,
            'popularTags' => $popularTags,
            'filters' => $filters,
        ]);
    }

    public function show(Blog $blog)
    {
        $blog->load([
            'author:id,name,avatar,bio',
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

        // Get related blogs
        $relatedBlogs = Blog::where('id', '!=', $blog->id)
            ->where(function ($query) use ($blog) {
                $query->whereHas('tags', function ($q) use ($blog) {
                        $q->whereIn('tags.id', $blog->tags->pluck('id'));
                    });
            })
            ->with('author:id,name')
            ->latest('published_at')
            ->take(3)
            ->get();

        $popularTags = $this->contentService->getPopularTags('blog');

        return Inertia::render('frontend/blogs/show', [
            'blog' => $blog,
            'popularTags' => $popularTags,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }
}
