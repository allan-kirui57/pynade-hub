<?php
// app/Http/Controllers/Admin/BlogController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Blog;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::query()
            ->with('author:id,name')
            ->withCount('comments');

        // Handle search
        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $blogs = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/blogs/Index', [
            'blogs' => $blogs,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        $tags = Tag::get(['id', 'name']);

        return Inertia::render('admin/blogs/Create', [
            'tags' => $tags,
        ]);
    }

    public function store(StoreBlogRequest $request)
    {

        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['user_id'] = Auth::id();

            $blog = Blog::create($data);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'An error occurred while creating the blog.'])->withInput();
        }
        // Handle image upload
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('blogs', 'public');
            $validated['featured_image'] = $path;
        }

        // Sync tags
        if (!empty($data['tags'])) {
            $blog->syncTags($data['tags'], 'blog');
        }

        return Inertia::render('admin/blogs/Index')
            ->with('success', 'Blog created successfully.');
    }

    public function show(Blog $blog)
    {
        return Inertia::render('admin/blogs/Show', ['blog' => $blog]);
    }

    public function edit(Blog $blog)
    {
        $blog->load(['tags']);

        $tags = Tag::inGroup('blog')->get(['id', 'name']);

        return Inertia::render('admin/blogs/Edit', [
            'blog' => $blog,
            'tags' => $tags,
            'selectedTags' => $blog->tags->pluck('name'),
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array',
            'published_at' => 'nullable|date',
        ]);

        // Handle image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($blog->featured_image) {
                Storage::disk('public')->delete($blog->featured_image);
            }

            $path = $request->file('featured_image')->store('blogs', 'public');
            $validated['featured_image'] = $path;
        }

        // Update blog
        $blog->title = $validated['title'];
        // Only update slug if title changed
        if ($blog->title !== $validated['title']) {
            $blog->slug = Str::slug($validated['title']);
        }
        $blog->content = $validated['content'];
        $blog->excerpt = $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 150);
        if (isset($validated['featured_image'])) {
            $blog->featured_image = $validated['featured_image'];
        }
        $blog->published_at = $validated['published_at'] ?? $blog->published_at;
        $blog->save();

        // Sync tags
        if (isset($validated['tags'])) {
            $blog->syncTags($validated['tags'], 'blog');
        }

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog updated successfully.');
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog deleted successfully.');
    }
}
