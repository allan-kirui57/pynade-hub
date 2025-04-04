<?php
// database/migrations/2023_03_30_000012_create_categorizables_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorizables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->morphs('categorizable');
            $table->timestamps();

            // Ensure a category can only be attached once to a model
            $table->unique(['category_id', 'categorizable_id', 'categorizable_type'], 'unique_categorizable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorizables');
    }
};
