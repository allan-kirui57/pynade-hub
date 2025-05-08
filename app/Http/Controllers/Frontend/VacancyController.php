<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VacancyController extends Controller
{
    function index()
    {
        return Inertia::render('frontend/vacancies');
    }
}
