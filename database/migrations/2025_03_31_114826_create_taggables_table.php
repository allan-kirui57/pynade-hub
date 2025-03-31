<?php
// database/migrations/2023_03_30_000011_create_taggables_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taggables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->morphs('taggable');
            $table->string('tag_group')->default('default');
            $table->timestamps();

            // Ensure a tag can only be attached once to a model in a specific group
            $table->unique(['tag_id', 'taggable_id', 'taggable_type', 'tag_group'], 'unique_taggable');

            // Add index for faster lookups
            $table->index('tag_group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taggables');
    }
};
