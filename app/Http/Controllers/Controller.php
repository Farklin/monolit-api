<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Проверка прав доступа пользователя
     *
     * @param string $permission Название разрешения для проверки
     * @param string|null $message Кастомное сообщение об ошибке
     * @return JsonResponse|null Возвращает JsonResponse с ошибкой 403 или null если проверка пройдена
     */
    protected function checkPermission(string $permission, ?string $message = null): ?JsonResponse
    {
        $user = request()->user();

        if (!$user || !$user->hasPermissionTo($permission)) {
            $defaultMessage = 'У вас недостаточно прав для выполнения этого действия';
            return response()->json([
                'message' => $message ?? $defaultMessage,
                'required_permission' => $permission
            ], 403);
        }

        return null;
    }
}
