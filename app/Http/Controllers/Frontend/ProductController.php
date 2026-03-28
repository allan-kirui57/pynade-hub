<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Get query parameters
        $search = $request->input('search');
        $pricing = $request->input('pricing');
        $openSource = $request->boolean('open_source');
        $sort = $request->input('sort', 'latest');

        // Build query
        $query = Product::query();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply pricing filter
        if ($pricing) {
            $query->where('pricing_type', ucfirst($pricing));
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
                $query->orderBy('stars_count', 'desc');
                break;
            case 'trending':
                // Trending could be a combination of recent + popular
                $query->where('created_at', '>=', now()->subDays(30));
//                    ->orderBy('upvotes', 'desc');
                break;
            case 'latest':
            default:
                $query->latest('created_at');
                break;
        }

        // Get paginated results
        $products = $query->paginate(12)->withQueryString();

        // Get featured products (could be manually curated or based on some criteria)
        $featuredProducts = Product::where('is_featured', true)
            ->take(3)
            ->get();

        // Get popular products
        $popularProducts = Product::orderBy('stars_count', 'desc')
            ->take(3)
            ->get();

        // Get new arrivals
        $newArrivals = Product::latest('created_at')
            ->take(3)
            ->get();

        // Get open source picks
        $openSourcePicks = Product::where('is_open_source', true)
            ->orderBy('stars_count', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('frontend/products/index', [
            'products' => $products,
            'featuredProducts' => $featuredProducts,
            'openSourcePicks' => $openSourcePicks,
            'filters' => $request->only(['search', 'pricing', 'open_source', 'sort']),

        ]);
    }

    public function show(Product $product)
    {
//        $product = Product::with(['relatedProducts'])
//            ->where('slug', $slug)
//            ->firstOrFail();

        // Increment view count
//        $product->increment('views');

        return Inertia::render('frontend/products/show', [
            'product' => $product,
        ]);
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
