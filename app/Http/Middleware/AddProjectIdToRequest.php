<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddProjectIdToRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Получаем project_id из заголовка X-Project-Id
        $projectId = $request->header('X-Project-Id');

        if ($projectId) {
            $request->merge(['current_project_id' => $projectId]);
            $request->attributes->set('project_id', $projectId);
        }

        $contextId = $request->header('X-Context-Id');
        if ($contextId) {
            $request->merge(['current_context_id' => $contextId]);
            $request->attributes->set('context_id', $contextId);
        }

        return $next($request);
    }
}

