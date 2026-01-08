<?php

namespace App\Providers;

use App\Services\ApiErrorFormatter;
use App\Services\ApiExceptionHandler;
use App\Services\ExceptionReporter;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ApiErrorFormatter::class);
        $this->app->singleton(ExceptionReporter::class);

        $this->app->singleton(ApiExceptionHandler::class, function ($app) {
            return new ApiExceptionHandler(
                responses: $app->make(\Illuminate\Contracts\Routing\ResponseFactory::class),
                formatter: $app->make(ApiErrorFormatter::class),
                reporter: $app->make(ExceptionReporter::class),
                config: $app['config']->get('apiErrors'),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::loadKeysFrom(storage_path());
        Passport::tokensCan([
        'admin' => 'Access administrative operations',
        'user' => 'Access standard user operations',
    ]);
    }
}
