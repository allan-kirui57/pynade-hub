<?php
// database/migrations/2023_03_30_000002_create_products_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->string('file_url')->nullable();
            $table->string('selling_price')->nullable();
            $table->string('discounted_price')->nullable();
            $table->enum('pricing_type', ['Free', 'Freemium', 'Paid', 'Subscription'])->default('Free');
            $table->boolean('is_open_source')->default(false);
            $table->string('repo_url')->nullable();
            $table->string('website_url')->nullable();
            $table->unsignedInteger('stars_count')->default(0);
            $table->unsignedInteger('forks_count')->default(0);
            $table->unsignedInteger('watchers_count')->default(0);
            $table->timestamp('last_synced_at')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_on_offer')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
