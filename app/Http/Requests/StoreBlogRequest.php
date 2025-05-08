<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // Convert category_id to integer or null
        if ($this->has('category_id')) {
            if ($this->category_id === '' || $this->category_id === null) {
                $this->merge(['category_id' => null]);
            } else {
                $this->merge(['category_id' => (int) $this->category_id]);
            }
        }

        // Convert is_featured to boolean
        if ($this->has('is_featured')) {
            $this->merge(['is_featured' => (bool) $this->is_featured]);
        }

        // You can add other type conversions here if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blogs,slug,' . $this->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'category_id' => 'required|integer|exists:categories,id',
            'featured_image' => $this->method() === 'POST'
                ? 'nullable|image|max:2048'
                : 'nullable|sometimes|image|max:2048',
            'published_at' => 'nullable|date',
            'is_featured' => 'boolean',
//            'tags' => 'nullable|array',
//            'tags.*' => 'exists:tags,id',
            // Add other validation rules as needed
        ];
    }
}
