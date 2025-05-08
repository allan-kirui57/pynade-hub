<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        // Fetch categories with pagination
        $categories = Category::query()
            ->with('parent:id,name')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        // Fetch all categories for the parent dropdown
        $categories = Category::all(['id', 'name']);

        return Inertia::render('admin/categories/Create', [
            'categories' => $categories,
        ]);
    }
}
