<?php

namespace App\Providers;

use App\Contracts\Dao\ProductDaoInterface;
use App\Contracts\Services\ProductServiceInterface;
use App\Services\ProductService;
use App\Dao\ProductDao;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // --- Contacts Module Binding ---
        $this->app->bind(
            \App\Contracts\Dao\ContactDaoInterface::class,
            \App\Dao\ContactDao::class
        );
        $this->app->bind(
            \App\Contracts\Services\ContactServiceInterface::class,
            \App\Services\ContactService::class
        );

        $this->app->bind(
            \App\Contracts\Dao\WarehouseDaoInterface::class,
            \App\Dao\WarehouseDao::class
        );

        $this->app->bind(
            \App\Contracts\Dao\StockDaoInterface::class,
            \App\Dao\StockDao::class
        );

        $this->app->bind(\App\Contracts\Dao\SalesOrderDaoInterface::class, \App\Dao\SalesOrderDao::class);
        $this->app->bind(\App\Contracts\Services\SalesOrderServiceInterface::class, \App\Services\SalesOrderService::class);
        $this->app->bind(\App\Contracts\Dao\InvoiceDaoInterface::class, \App\Dao\InvoiceDao::class);

        // --- Products Module Binding ---
        $this->app->bind(
            \App\Contracts\Dao\ProductDaoInterface::class,
            \App\Dao\ProductDao::class
        );
        $this->app->bind(
            \App\Contracts\Services\ProductServiceInterface::class,
            \App\Services\ProductService::class
        );

        $this->app->bind(
            \App\Contracts\Services\WarehouseServiceInterface::class,
            \App\Services\WarehouseService::class
        );

        $this->app->bind(
            \App\Contracts\Services\StockServiceInterface::class,
            \App\Services\StockService::class
        );

        $this->app->bind(\App\Contracts\Dao\WarehouseDaoInterface::class, \App\Dao\WarehouseDao::class);
        $this->app->bind(\App\Contracts\Services\WarehouseServiceInterface::class, \App\Services\WarehouseService::class);
        $this->app->bind(\App\Contracts\Dao\StockDaoInterface::class, \App\Dao\StockDao::class);
        $this->app->bind(\App\Contracts\Services\StockServiceInterface::class, \App\Services\StockService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null
        );
    }
}
