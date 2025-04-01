<?php

use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\ProductController;
use App\Http\Controllers\Frontend\VacancyController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
Route::get('/blogs/{blog:slug}', [BlogController::class, 'show'])->name('blogs.show');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('/vacancies', [VacancyController::class, 'index'])->name('vacancies.index');
Route::get('/vacancies/{vacancy:slug}', [VacancyController::class, 'show'])->name('vacancies.show');
