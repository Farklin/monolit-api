<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\Users\UserNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Отправить системное уведомление (всем)
     */
    public function send(Request $request): JsonResponse
    {
        $message = $request->input('message', 'Test notification');
        $title = $request->input('title', 'Notification');
        $type = $request->input('type', 'info'); // info, success, warning, error

        event(new MessageSent($message, $title, $type));

        return response()->json([
            'status' => 'success',
            'message' => 'System notification sent successfully',
            'data' => [
                'title' => $title,
                'message' => $message,
                'type' => $type
            ]
        ]);
    }

    /**
     * Отправить персональное уведомление конкретному пользователю
     */
    public function sendToUser(Request $request, $userId): JsonResponse
    {
        $user = User::findOrFail($userId);

        $message = $request->input('message', 'Test notification');
        $title = $request->input('title', 'Notification');
        $type = $request->input('type', 'info'); // info, success, warning, error

        event(new UserNotification($user, $message, $title, $type));

        return response()->json([
            'status' => 'success',
            'message' => 'User notification sent successfully',
            'data' => [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'title' => $title,
                'message' => $message,
                'type' => $type
            ]
        ]);
    }
}

