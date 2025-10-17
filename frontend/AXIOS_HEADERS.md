# 📡 Axios Interceptor - Автоматическая отправка Project ID

## Описание

Все HTTP запросы автоматически отправляют **`X-Project-Id`** в заголовках, если проект выбран в шапке. Это позволяет Laravel API знать, в контексте какого проекта выполняется запрос.

---

## 🔧 Как это работает

### Frontend (React)

Создан централизованный экземпляр axios с interceptor:

**Файл:** `frontend/src/api/axios.js`

```javascript
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor добавляет X-Project-Id автоматически
axiosInstance.interceptors.request.use(
  (config) => {
    const selectedProjectId = localStorage.getItem('selectedProjectId')
    
    if (selectedProjectId) {
      config.headers['X-Project-Id'] = selectedProjectId
    }
    
    return config
  }
)

export default axiosInstance
```

### Все API модули используют этот экземпляр:

```javascript
// frontend/src/api/projects.js
import axios from './axios'  // ← Используем наш настроенный axios

export const projectsAPI = {
  getAll: async () => {
    const response = await axios.get('/projects')
    // Автоматически добавится заголовок X-Project-Id!
    return response.data
  }
}
```

---

## 🎯 Преимущества

### ✅ **Автоматизация**
Не нужно вручную добавлять project_id в каждый запрос

### ✅ **Консистентность**
Все запросы содержат информацию о текущем проекте

### ✅ **Безопасность**
Laravel может проверять права доступа на уровне middleware

### ✅ **Удобство**
В контроллерах Laravel можно легко получить текущий проект

---

## 📨 Пример запроса

**До (без interceptor):**
```http
GET /api/contexts HTTP/1.1
Host: localhost:8000
Content-Type: application/json
```

**После (с interceptor):**
```http
GET /api/contexts HTTP/1.1
Host: localhost:8000
Content-Type: application/json
X-Project-Id: 5
```

---

## 🔐 Backend (Laravel)

### Middleware для обработки заголовка

**Файл:** `app/Http/Middleware/AddProjectIdToRequest.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AddProjectIdToRequest
{
    public function handle(Request $request, Closure $next)
    {
        $projectId = $request->header('X-Project-Id');
        
        if ($projectId) {
            // Добавляем в request
            $request->merge(['current_project_id' => $projectId]);
            // Или в attributes
            $request->attributes->set('project_id', $projectId);
        }
        
        return $next($request);
    }
}
```

### Регистрация middleware

**Файл:** `app/Http/Kernel.php` (или `bootstrap/app.php` в Laravel 11)

```php
protected $middlewareGroups = [
    'api' => [
        // ...
        \App\Http\Middleware\AddProjectIdToRequest::class,
    ],
];
```

### Использование в контроллерах

```php
public function index(Request $request)
{
    // Получаем project_id из заголовка
    $projectId = $request->header('X-Project-Id');
    
    // Или из attributes
    $projectId = $request->attributes->get('project_id');
    
    // Или из merged data
    $projectId = $request->input('current_project_id');
    
    if ($projectId) {
        // Фильтруем данные по проекту
        return Context::where('project_id', $projectId)->get();
    }
    
    return Context::all();
}
```

---

## 🧪 Проверка в DevTools

### Chrome DevTools:

1. Откройте **DevTools** (F12)
2. Перейдите на вкладку **Network**
3. Сделайте любой запрос (например, откройте страницу контекстов)
4. Кликните на запрос
5. Перейдите на вкладку **Headers**
6. В секции **Request Headers** найдите: `X-Project-Id: 5`

---

## 🔄 Когда заголовок отправляется

### ✅ Отправляется:
- Проект выбран в шапке
- `localStorage` содержит `selectedProjectId`

### ❌ НЕ отправляется:
- Проект не выбран
- `localStorage` пустой
- Пользователь только открыл приложение и еще не выбрал проект

---

## 💡 Дополнительные возможности

### Логирование запросов

Добавьте логирование в interceptor для отладки:

```javascript
axiosInstance.interceptors.request.use(
  (config) => {
    const projectId = localStorage.getItem('selectedProjectId')
    
    if (projectId) {
      config.headers['X-Project-Id'] = projectId
      console.log('📡 Request with project:', projectId, config.url)
    }
    
    return config
  }
)
```

### Обработка ошибок

```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Нет доступа к проекту')
      // Можно перенаправить или показать уведомление
    }
    return Promise.reject(error)
  }
)
```

### Множественные заголовки

Можно добавить другие кастомные заголовки:

```javascript
// X-User-Id, X-Tenant-Id и т.д.
config.headers['X-User-Id'] = userId
config.headers['X-Timezone'] = userTimezone
```

---

## 🎉 Результат

Теперь каждый запрос к API автоматически содержит информацию о текущем проекте! Laravel может использовать это для:

- 🔒 **Авторизации** - проверка прав на проект
- 🔍 **Фильтрации** - автоматическая фильтрация данных
- 📊 **Аналитики** - отслеживание активности по проектам
- 🎯 **Логики** - любая бизнес-логика зависящая от проекта

---

## 🛠️ Для разработчиков

Все файлы API теперь используют централизованный axios:

- ✅ `frontend/src/api/axios.js` - настроенный экземпляр
- ✅ `frontend/src/api/projects.js` - использует axios.js
- ✅ `frontend/src/api/contexts.js` - использует axios.js
- ✅ `frontend/src/api/warehouses.js` - использует axios.js

**Не нужно** ничего менять в существующем коде! Просто работает! ✨

