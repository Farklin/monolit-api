# Утилиты фронтенда

## PermissionEnum

JavaScript enum для работы с разрешениями системы, аналогичный PHP enum `PermissonEnum`.

### Импорт

```javascript
import { PermissionEnum, getPermissionDisplayName, getAllPermissions } from '../utils/PermissionEnum'
// или
import { PermissionEnum } from '../utils'
```

### Основные константы

```javascript
// Проекты
PermissionEnum.CREATE_PROJECT    // 'create_project'
PermissionEnum.READ_PROJECT      // 'read_project'
PermissionEnum.UPDATE_PROJECT    // 'update_project'
PermissionEnum.DELETE_PROJECT    // 'delete_project'

// Контексты
PermissionEnum.CREATE_CONTEXT    // 'create_context'
PermissionEnum.READ_CONTEXT      // 'read_context'
PermissionEnum.UPDATE_CONTEXT    // 'update_context'
PermissionEnum.DELETE_CONTEXT    // 'delete_context'

// Склады
PermissionEnum.CREATE_WAREHOUSE  // 'create_warehouse'
PermissionEnum.READ_WAREHOUSE    // 'read_warehouse'
PermissionEnum.UPDATE_WAREHOUSE  // 'update_warehouse'
PermissionEnum.DELETE_WAREHOUSE  // 'delete_warehouse'

// Складские остатки
PermissionEnum.CREATE_WAREHOUSE_STOCK  // 'create_warehouse_stock'
PermissionEnum.READ_WAREHOUSE_STOCK    // 'read_warehouse_stock'
PermissionEnum.UPDATE_WAREHOUSE_STOCK  // 'update_warehouse_stock'
PermissionEnum.DELETE_WAREHOUSE_STOCK  // 'delete_warehouse_stock'

// Пользователи
PermissionEnum.CREATE_USER       // 'create_user'
PermissionEnum.READ_USER         // 'read_user'
PermissionEnum.UPDATE_USER       // 'update_user'
PermissionEnum.DELETE_USER       // 'delete_user'

// Разрешения
PermissionEnum.CREATE_PERMISSION // 'create_permission'
PermissionEnum.READ_PERMISSION   // 'read_permission'
PermissionEnum.UPDATE_PERMISSION // 'update_permission'
PermissionEnum.DELETE_PERMISSION // 'delete_permission'

// Управление разрешениями и ролями пользователей
PermissionEnum.HANDLE_USERS_PERMISSIONS // 'handle_users_permissions'
PermissionEnum.HANDLE_USERS_ROLES       // 'handle_users_roles'
```

### Вспомогательные функции

#### `getAllPermissions()`

Возвращает массив всех доступных разрешений.

```javascript
const allPermissions = getAllPermissions()
// ['create_project', 'read_project', 'update_project', ...]
```

#### `getPermissionDisplayName(permission)`

Возвращает человекочитаемое название разрешения на русском языке.

```javascript
getPermissionDisplayName('create_project') // 'Создание проектов'
getPermissionDisplayName('read_user')      // 'Просмотр пользователей'
```

#### `isValidPermission(permission)`

Проверяет, является ли строка валидным разрешением.

```javascript
isValidPermission('create_project') // true
isValidPermission('invalid_permission') // false
```

#### Группированные функции

```javascript
getProjectPermissions()           // Разрешения для проектов
getContextPermissions()           // Разрешения для контекстов
getWarehousePermissions()         // Разрешения для складов
getWarehouseStockPermissions()    // Разрешения для складских остатков
getUserPermissions()              // Разрешения для пользователей
getPermissionManagementPermissions() // Разрешения для управления разрешениями
```

### Примеры использования

#### В компонентах React

```javascript
import { PermissionEnum, getPermissionDisplayName } from '../utils/PermissionEnum'

const MyComponent = () => {
  const checkPermission = (permission) => {
    // Проверка разрешения
    return userPermissions.includes(permission)
  }

  return (
    <div>
      {checkPermission(PermissionEnum.CREATE_PROJECT) && (
        <button>Создать проект</button>
      )}
      
      <span>{getPermissionDisplayName('read_user')}</span>
    </div>
  )
}
```

#### В формах

```javascript
import { getAllPermissions, getPermissionDisplayName } from '../utils/PermissionEnum'

const PermissionSelector = () => {
  return (
    <select>
      {getAllPermissions().map(permission => (
        <option key={permission} value={permission}>
          {getPermissionDisplayName(permission)}
        </option>
      ))}
    </select>
  )
}
```

#### В API запросах

```javascript
import { PermissionEnum } from '../utils/PermissionEnum'

const createUserWithPermissions = async (userData) => {
  const response = await axios.post('/users', {
    ...userData,
    permissions: [
      PermissionEnum.READ_USER,
      PermissionEnum.UPDATE_USER
    ]
  })
  return response.data
}
```

### Синхронизация с бэкендом

Этот enum должен быть синхронизирован с PHP enum `PermissonEnum.php`. При добавлении новых разрешений в бэкенд необходимо:

1. Добавить новую константу в `PermissionEnum`
2. Добавить человекочитаемое название в функцию `getPermissionDisplayName`
3. При необходимости добавить в соответствующую группированную функцию

### Структура файлов

```text
frontend/src/utils/
├── PermissionEnum.js    # Основной enum и функции
├── index.js            # Экспорт всех утилит
└── README.md           # Документация
```
