<?php
// app/Traits/HasCategories.php

namespace App\Traits;

use App\Models\Category;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasCategories
{
    /**
     * Get the model's categories.
     */
    public function categories(): MorphToMany
    {
        return $this->morphToMany(Category::class, 'categorizable')
            ->withTimestamps();
    }

    /**
     * Set the primary category for this model.
     */
    public function setPrimaryCategory(Category $category): void
    {
        $this->primary_category_id = $category->id;
        $this->save();

        // Ensure the category is attached
        if (!$this->categories()->where('categories.id', $category->id)->exists()) {
            $this->categories()->attach($category->id);
        }
    }

    /**
     * Get the primary category.
     */
    public function primaryCategory()
    {
        return $this->belongsTo(Category::class, 'primary_category_id');
    }

    /**
     * Sync categories to the model.
     */
    public function syncCategories(array $categoryIds): void
    {
        $this->categories()->sync($categoryIds);

        // If primary category was removed, update it
        if (!in_array($this->primary_category_id, $categoryIds)) {
            $this->primary_category_id = count($categoryIds) > 0 ? $categoryIds[0] : null;
            $this->save();
        }
    }
}
