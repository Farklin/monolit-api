<?php

namespace App\Events\Users;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class RegisterUser implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public User $user)
    {
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('system-notifications'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'title' => 'Новый пользователь зарегистрирован',
            'message' => 'Зарегистрирован новый пользователь: ' . $this->user->name . "(ID: " . $this->user->id . ")",
            'type' => 'info',
            'time' => now()->toDateTimeString(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'MessageSent';
    }
}
