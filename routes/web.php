<?php

use App\Http\Controllers\AccountingController;
use App\Http\Controllers\MasterData\ContactController;
use App\Http\Controllers\MasterData\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/contacts', [ContactController::class, 'index'])->name('contacts.index');
    Route::post('/contacts', [ContactController::class, 'store'])->name('contacts.store');
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy'])->name('contacts.destroy');

    Route::resource('products', ProductController::class);
    Route::resource('warehouse', WarehouseController::class);
    Route::resource('stocks', StockController::class);

    Route::resource('sales', SalesOrderController::class);
    Route::get('/accounting/journals', [AccountingController::class, 'index'])->name('journals.index');
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
});

require __DIR__ . '/settings.php';
