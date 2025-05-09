<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        if ($this->has('category_id')) {
            if ($this->category_id === '' || $this->category_id === null) {
                $this->merge(['category_id' => null]);
            } else {
                $this->merge(['category_id' => (int) $this->category_id]);
            }
        }
        if ($this->has('pricing_type')) {
            if ($this->pricing_type === '' || $this->pricing_type === null) {
                $this->merge(['pricing_type' => null]);
            } else {
                $this->merge(['pricing_type' => ucfirst($this->pricing_type)]);
            }
        }

        // Convert is_featured to boolean
        if ($this->has('is_featured')) {
            $this->merge(['is_featured' => (bool) $this->is_featured]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'pricing_type' => 'required|string|in:Free,Paid,Freemium',
            'is_open_source' => 'boolean',
            'repo_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'stars_count' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'image' => 'nullable|image|max:2048', // 2MB max
        ];
    }
}
