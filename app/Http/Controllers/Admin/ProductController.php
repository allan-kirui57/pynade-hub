<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\StoreProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\GitHubService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{

    protected $githubService;

    public function __construct(GitHubService $gitHubService)
    {
        $this->githubService = $gitHubService;
    }

    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $query = Product::query()
            ->with(['primaryCategory', 'user'])
            ->latest();

        // Apply filters if provided
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('primary_category_id', $request->category);
        }

        if ($request->filled('pricing_type')) {
            $query->where('pricing_type', $request->pricing_type);
        }

        if ($request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        $products = $query->paginate(10)
            ->withQueryString()
            ->through(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'image' => $product->image,
                'pricing_type' => $product->pricing_type,
                'is_open_source' => $product->is_open_source,
                'repo_url' => $product->repo_url,
                'website_url' => $product->website_url,
                'stars_count' => $product->stars_count,
                'is_featured' => $product->is_featured,
                'created_at' => $product->created_at,
                'primaryCategory' => $product->primaryCategory ? [
                    'id' => $product->primaryCategory->id,
                    'name' => $product->primaryCategory->name,
                ] : null,
                'user' => $product->user ? [
                    'id' => $product->user->id,
                    'name' => $product->user->name,
                ] : null,
            ]);

        $categories = Category::select('id', 'name')->get();

        return Inertia::render('admin/products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'pricing_type', 'is_featured']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('admin/products/Create', [
            'categories' => $categories,
            'pricingTypes' => $this->getPricingTypes(),
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request)
    {
        DB::transaction(function () use ($request) {

            $validatedData = $request->all();

            // Generate slug from name
            $validatedData['slug'] = Str::slug($validatedData['name']);

            // Set the authenticated user as the owner
            $validatedData['user_id'] = Auth::id();

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $validatedData['image'] = $path;
            }

            // Create the product
            $product = Product::create($validatedData);

            if (!empty($validated['repo_url'])) {
                $stats = $this->githubService->getRepositoryStats($validated['repo_url']);

                if ($stats) {
                    $product->update([
                        'stars_count' => $stats['stars'],
                        'forks_count' => $stats['forks'],
                        'watchers_count' => $stats['watchers'],
                        'last_synced_at' => $stats['last_synced_at'],
                    ]);
                }
            }
        });


        return Redirect::route('products.index')
            ->with('message', ['type' => 'success', 'text' => 'Product created successfully']);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load(['primaryCategory', 'user']);

        return Inertia::render('admin/products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'image' => $product->image,
                'pricing_type' => $product->pricing_type,
                'is_open_source' => $product->is_open_source,
                'repo_url' => $product->repo_url,
                'website_url' => $product->website_url,
                'stars_count' => $product->stars_count,
                'is_featured' => $product->is_featured,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
                'primaryCategory' => $product->primaryCategory ? [
                    'id' => $product->primaryCategory->id,
                    'name' => $product->primaryCategory->name,
                ] : null,
                'user' => $product->user ? [
                    'id' => $product->user->id,
                    'name' => $product->user->name,
                ] : null,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('admin/products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'image' => $product->image,
                'pricing_type' => $product->pricing_type,
                'is_open_source' => $product->is_open_source,
                'repo_url' => $product->repo_url,
                'website_url' => $product->website_url,
                'stars_count' => $product->stars_count,
                'is_featured' => $product->is_featured,
                'primary_category_id' => $product->primary_category_id,
            ],
            'categories' => $categories,
            'pricingTypes' => $this->getPricingTypes(),
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'primary_category_id' => 'required|exists:categories,id',
            'pricing_type' => 'required|string|in:free,paid,freemium',
            'is_open_source' => 'boolean',
            'repo_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'stars_count' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        // Update slug only if name has changed
        if ($product->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        // Update the product
        $product->update($validated);

        return Redirect::route('products.show', $product)
            ->with('message', ['type' => 'success', 'text' => 'Product updated successfully']);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        // Delete the product image if it exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return Redirect::route('products.index')
            ->with('message', ['type' => 'success', 'text' => 'Product deleted successfully']);
    }

    /**
     * Get array of pricing types for dropdown.
     */
    private function getPricingTypes(): array
    {
        return [
            'free' => 'Free',
            'paid' => 'Paid',
            'freemium' => 'Freemium',
            'subscription' => 'Subscription'
        ];
    }

    protected function updateGitHubStats(Product $product): void
    {
        $stats = $this->githubService->getRepositoryStats($product->github_url);

        if ($stats) {
            $product->update([
                'stars' => $stats['stars'],
                'forks' => $stats['forks'],
                'watchers' => $stats['watchers'],
                'last_synced_at' => $stats['last_synced_at'],
            ]);
        }
    }
}
