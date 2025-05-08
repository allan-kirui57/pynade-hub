<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Build query
        $products = Product::with(['category'])
            ->published()->get();

        $categories = Category::all();

        return Inertia::render('frontend/products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/products/create');
    }

}
