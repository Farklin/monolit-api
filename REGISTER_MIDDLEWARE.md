# 🔧 Регистрация Middleware для Project ID

## Laravel 11 (современный способ)

Откройте файл `bootstrap/app.php` и добавьте middleware:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Добавляем middleware для API routes
        $middleware->api(append: [
            \App\Http\Middleware\AddProjectIdToRequest::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

---

## Laravel 10 и старше

Откройте файл `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'web' => [
        // ...
    ],

    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        
        // Добавьте эту строку
        \App\Http\Middleware\AddProjectIdToRequest::class,
    ],
];
```

---

## ✅ Проверка работы

После регистрации middleware вы можете использовать project_id в контроллерах:

```php
public function index(Request $request)
{
    // Способ 1: Через заголовок
    $projectId = $request->header('X-Project-Id');
    
    // Способ 2: Через merged data (после middleware)
    $projectId = $request->input('current_project_id');
    
    // Способ 3: Через attributes
    $projectId = $request->attributes->get('project_id');
    
    if ($projectId) {
        return Context::where('project_id', $projectId)->get();
    }
    
    return Context::all();
}
```

---

## 🎯 Готово!

Теперь все запросы с фронтенда автоматически передают project_id в заголовках! 🚀

