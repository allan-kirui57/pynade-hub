<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Get query parameters
        $search = $request->input('search');
        $categorySlug = $request->input('category');
        $pricing = $request->input('pricing');
        $openSource = $request->boolean('open_source');
        $sort = $request->input('sort', 'latest');

        // Build query
        $query = Product::with(['category'])
            ->published();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply category filter
        if ($categorySlug) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Apply pricing filter
        if ($pricing) {
            $query->where('pricing', ucfirst($pricing));
        }

        // Apply open source filter
        if ($openSource) {
            $query->where('is_open_source', true);
        }

        // Apply sorting
        switch ($sort) {
            case 'oldest':
                $query->oldest('created_at');
                break;
            case 'popular':
                $query->orderBy('upvotes', 'desc');
                break;
            case 'trending':
                // Trending could be a combination of recent + popular
                $query->where('created_at', '>=', now()->subDays(30))
                    ->orderBy('upvotes', 'desc');
                break;
            case 'latest':
            default:
                $query->latest('created_at');
                break;
        }

        // Get paginated results
        $products = $query->paginate(12)->withQueryString();

        // Get categories with product count
        $categories = Category::withCount('products')
            ->orderBy('products_count', 'desc')
            ->take(10)
            ->get();

        // Get featured products (could be manually curated or based on some criteria)
        $featuredProducts = Product::with(['category'])
            ->published()
            ->where('is_featured', true)
            ->take(3)
            ->get();

        // Get popular products
        $popularProducts = Product::with(['category'])
            ->published()
            ->orderBy('upvotes', 'desc')
            ->take(3)
            ->get();

        // Get new arrivals
        $newArrivals = Product::with(['category'])
            ->published()
            ->latest('created_at')
            ->take(3)
            ->get();

        // Get open source picks
        $openSourcePicks = Product::with(['category'])
            ->published()
            ->where('is_open_source', true)
            ->orderBy('stars', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('frontend/products', [
            'products' => $products,
            'categories' => $categories,  [
                'products' => $products,
                'categories' => $categories,
                'featuredProducts' => $featuredProducts,
                'popularProducts' => $popularProducts,
                'newArrivals' => $newArrivals,
                'openSourcePicks' => $openSourcePicks,
                'filters' => $request->only(['search', 'category', 'pricing', 'open_source', 'sort']),
            ]
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'relatedProducts'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $product->increment('views');

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    public function byCategory($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        return redirect()->route('products.index', ['category' => $slug]);
    }

    public function featured()
    {
        return redirect()->route('products.index', ['featured' => true]);
    }

    public function popular()
    {
        return redirect()->route('products.index', ['sort' => 'popular']);
    }

    public function new()
    {
        return redirect()->route('products.index', ['sort' => 'latest']);
    }

    public function openSource()
    {
        return redirect()->route('products.index', ['open_source' => true]);
    }
}
