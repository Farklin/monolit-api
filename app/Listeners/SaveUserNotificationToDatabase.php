<?php

namespace App\Listeners;

use App\Events\Users\UserNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\SystemNotification;
use App\Events\MessageSent;

class SaveUserNotificationToDatabase
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserNotification|MessageSent $event): void
    {
        SystemNotification::create([
            'user_id' => $event->user->id ?? null,
            'title' => $event->title,
            'message' => $event->message,
            'type' => $event->type,
            'read' => false,
        ]);
    }
}
