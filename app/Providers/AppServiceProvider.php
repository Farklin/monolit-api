<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Events\Users\UserNotification;
use App\Listeners\SaveUserNotificationToDatabase;
use Illuminate\Support\Facades\Event;
use App\Events\MessageSent;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(
            UserNotification::class,
            SaveUserNotificationToDatabase::class,
        );

        Event::listen(
            MessageSent::class,
            SaveUserNotificationToDatabase::class,
        );
    }
}
