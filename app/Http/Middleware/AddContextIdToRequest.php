<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddContextIdToRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Получаем context_id из заголовка X-Context-Id
        $contextId = $request->header('X-Context-Id');

        if ($contextId) {
            // Добавляем context_id в request для использования в контроллерах
            $request->merge(['current_context_id' => $contextId]);

            // Или можно добавить в attributes для более явного использования
            $request->attributes->set('context_id', $contextId);
        }

        return $next($request);
    }
}

