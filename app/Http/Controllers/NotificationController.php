<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\Users\UserNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Enum\PermissonEnum;
use App\Enum\NotificationTypeEnum;
use App\Http\Requests\Notification\CreateNotificationRequest;
use App\Http\Requests\Notification\CreateNotificationToUserRequest;

class NotificationController extends Controller
{
    /**
     * Отправить системное уведомление (всем)
     */
    public function send(CreateNotificationRequest $request): JsonResponse
    {
        if ($error = $this->checkPermission(PermissonEnum::SEND_NOTIFICATION->value, 'У вас недостаточно прав для отправки уведомления')) {
            return $error;
        }
        $data = $request->validated();
        $message = $data['message'];
        $title = $data['title'];
        $type = $data['type'];

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
    public function sendToUser(CreateNotificationToUserRequest $request): JsonResponse
    {
        if ($error = $this->checkPermission(PermissonEnum::SEND_USER_NOTIFICATION->value, 'У вас недостаточно прав для отправки уведомления')) {
            return $error;
        }
        $data = $request->validated();

        $message = $data['message'];
        $title = $data['title'];
        $type = $data['type'];
        $user = User::findOrFail($data['user_id']);

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
