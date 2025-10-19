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
use App\Models\SystemNotification;
use Illuminate\Support\Facades\Redis;

class NotificationController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/notifications",
     *     summary="Получить уведомления для текущего пользователя",
     *     tags={"Notifications"},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function index(Request $request)
    {
        return SystemNotification::where('user_id', auth()->id())->orWhereNull('user_id')
        ->orderBy('created_at', 'desc')
        ->limit(15)
        ->get();
    }


    /**
     * @OA\Post(
     *     path="/api/notifications/send",
     *     summary="Отправить системное уведомление всем пользователям",
     *     tags={"Notifications"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Notification Message"),
     *             @OA\Property(property="title", type="string", example="Notification Title"),
     *             @OA\Property(property="type", type="string", example="info")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="System notification sent successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="System notification sent successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="title", type="string", example="Notification Title"),
     *                 @OA\Property(property="message", type="string", example="Notification Message"),
     *                 @OA\Property(property="type", type="string", example="info")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function send(CreateNotificationRequest $request): JsonResponse
    {

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
     * @OA\Post(
     *     path="/api/notifications/send-to-user",
     *     summary="Отправить персональное уведомление конкретному пользователю",
     *     tags={"Notifications"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="message", type="string", example="Notification Message"),
     *             @OA\Property(property="title", type="string", example="Notification Title"),
     *             @OA\Property(property="type", type="string", example="info")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="User notification sent successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="user_name", type="string", example="John Doe"),
     *                 @OA\Property(property="title", type="string", example="Notification Title"),
     *                 @OA\Property(property="message", type="string", example="Notification Message"),
     *                 @OA\Property(property="type", type="string", example="info")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     )
     * )
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

    /**
     * @OA\Put(
     *     path="/api/notifications/{id}/read",
     *     summary="Отметить уведомление как прочитанное",
     *     tags={"Notifications"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function markAsRead($id): JsonResponse
    {
        $notification = SystemNotification::where('id', $id)
            ->where(function ($query) {
                $query->where('user_id', auth()->id())
                      ->orWhereNull('user_id');
            })
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notification marked as read'
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/notifications/mark-all-read",
     *     summary="Отметить все уведомления как прочитанные",
     *     tags={"Notifications"},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function markAllAsRead(): JsonResponse
    {
        SystemNotification::where(function ($query) {
            $query->where('user_id', auth()->id())
                  ->orWhereNull('user_id');
        })
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'All notifications marked as read'
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/notifications/{id}",
     *     summary="Удалить уведомление",
     *     tags={"Notifications"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function destroy($id): JsonResponse
    {
        $notification = SystemNotification::where('id', $id)
            ->where(function ($query) {
                $query->where('user_id', auth()->id())
                      ->orWhereNull('user_id');
            })
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Notification deleted'
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/notifications/clear-all",
     *     summary="Очистить все уведомления",
     *     tags={"Notifications"},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function clearAll(): JsonResponse
    {
        SystemNotification::where('user_id', auth()->id())->orWhereNull('user_id')->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'All notifications cleared'
        ]);
    }
}
