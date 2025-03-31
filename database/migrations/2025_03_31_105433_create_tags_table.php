<?php
// database/migrations/2023_03_30_000005_create_tags_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('group')->default('default');
            $table->text('description')->nullable();
            $table->timestamps();

            // Add index for faster lookups
            $table->index('group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
