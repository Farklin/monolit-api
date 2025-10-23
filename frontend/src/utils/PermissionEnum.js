/**
 * Enum для разрешений системы
 * Аналогичен PHP enum PermissonEnum
 */
export const PermissionEnum = {
  // Проекты
  CREATE_PROJECT: 'create_project',
  READ_PROJECT: 'read_project',
  UPDATE_PROJECT: 'update_project',
  DELETE_PROJECT: 'delete_project',

  // Контексты
  CREATE_CONTEXT: 'create_context',
  READ_CONTEXT: 'read_context',
  UPDATE_CONTEXT: 'update_context',
  DELETE_CONTEXT: 'delete_context',

  // Склады
  CREATE_WAREHOUSE: 'create_warehouse',
  READ_WAREHOUSE: 'read_warehouse',
  UPDATE_WAREHOUSE: 'update_warehouse',
  DELETE_WAREHOUSE: 'delete_warehouse',

  // Складские остатки
  CREATE_WAREHOUSE_STOCK: 'create_warehouse_stock',
  READ_WAREHOUSE_STOCK: 'read_warehouse_stock',
  UPDATE_WAREHOUSE_STOCK: 'update_warehouse_stock',
  DELETE_WAREHOUSE_STOCK: 'delete_warehouse_stock',

  // Пользователи
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // Разрешения
  CREATE_PERMISSION: 'create_permission',
  READ_PERMISSION: 'read_permission',
  UPDATE_PERMISSION: 'update_permission',
  DELETE_PERMISSION: 'delete_permission',

  // Управление разрешениями и ролями пользователей
  HANDLE_USERS_PERMISSIONS: 'handle_users_permissions',
  HANDLE_USERS_ROLES: 'handle_users_roles',

  // Баннеры
  CREATE_BANNER: 'create_banner',
  READ_BANNER: 'read_banner',
  UPDATE_BANNER: 'update_banner',
  DELETE_BANNER: 'delete_banner',

  // Категории баннеров
  CREATE_BANNER_CATEGORY: 'create_banner_category',
  READ_BANNER_CATEGORY: 'read_banner_category',
  UPDATE_BANNER_CATEGORY: 'update_banner_category',
  DELETE_BANNER_CATEGORY: 'delete_banner_category'
}

/**
 * Получить все разрешения для проектов
 */
export const getProjectPermissions = () => [
  PermissionEnum.CREATE_PROJECT,
  PermissionEnum.READ_PROJECT,
  PermissionEnum.UPDATE_PROJECT,
  PermissionEnum.DELETE_PROJECT
]

/**
 * Получить все разрешения для контекстов
 */
export const getContextPermissions = () => [
  PermissionEnum.CREATE_CONTEXT,
  PermissionEnum.READ_CONTEXT,
  PermissionEnum.UPDATE_CONTEXT,
  PermissionEnum.DELETE_CONTEXT
]

/**
 * Получить все разрешения для складов
 */
export const getWarehousePermissions = () => [
  PermissionEnum.CREATE_WAREHOUSE,
  PermissionEnum.READ_WAREHOUSE,
  PermissionEnum.UPDATE_WAREHOUSE,
  PermissionEnum.DELETE_WAREHOUSE
]

/**
 * Получить все разрешения для складских остатков
 */
export const getWarehouseStockPermissions = () => [
  PermissionEnum.CREATE_WAREHOUSE_STOCK,
  PermissionEnum.READ_WAREHOUSE_STOCK,
  PermissionEnum.UPDATE_WAREHOUSE_STOCK,
  PermissionEnum.DELETE_WAREHOUSE_STOCK
]

/**
 * Получить все разрешения для пользователей
 */
export const getUserPermissions = () => [
  PermissionEnum.CREATE_USER,
  PermissionEnum.READ_USER,
  PermissionEnum.UPDATE_USER,
  PermissionEnum.DELETE_USER
]

/**
 * Получить все разрешения для управления разрешениями
 */
export const getPermissionManagementPermissions = () => [
  PermissionEnum.CREATE_PERMISSION,
  PermissionEnum.READ_PERMISSION,
  PermissionEnum.UPDATE_PERMISSION,
  PermissionEnum.DELETE_PERMISSION,
  PermissionEnum.HANDLE_USERS_PERMISSIONS,
  PermissionEnum.HANDLE_USERS_ROLES
]

/**
 * Получить все разрешения для баннеров
 */
export const getBannerPermissions = () => [
  PermissionEnum.CREATE_BANNER,
  PermissionEnum.READ_BANNER,
  PermissionEnum.UPDATE_BANNER,
  PermissionEnum.DELETE_BANNER
]

/**
 * Получить все разрешения для категорий баннеров
 */
export const getBannerCategoryPermissions = () => [
  PermissionEnum.CREATE_BANNER_CATEGORY,
  PermissionEnum.READ_BANNER_CATEGORY,
  PermissionEnum.UPDATE_BANNER_CATEGORY,
  PermissionEnum.DELETE_BANNER_CATEGORY
]

/**
 * Получить все разрешения
 */
export const getAllPermissions = () => Object.values(PermissionEnum)

/**
 * Проверить, является ли строка валидным разрешением
 */
export const isValidPermission = (permission) => {
  return Object.values(PermissionEnum).includes(permission)
}

/**
 * Получить человекочитаемое название разрешения
 */
export const getPermissionDisplayName = (permission) => {
  const displayNames = {
    [PermissionEnum.CREATE_PROJECT]: 'Создание проектов',
    [PermissionEnum.READ_PROJECT]: 'Просмотр проектов',
    [PermissionEnum.UPDATE_PROJECT]: 'Редактирование проектов',
    [PermissionEnum.DELETE_PROJECT]: 'Удаление проектов',

    [PermissionEnum.CREATE_CONTEXT]: 'Создание контекстов',
    [PermissionEnum.READ_CONTEXT]: 'Просмотр контекстов',
    [PermissionEnum.UPDATE_CONTEXT]: 'Редактирование контекстов',
    [PermissionEnum.DELETE_CONTEXT]: 'Удаление контекстов',

    [PermissionEnum.CREATE_WAREHOUSE]: 'Создание складов',
    [PermissionEnum.READ_WAREHOUSE]: 'Просмотр складов',
    [PermissionEnum.UPDATE_WAREHOUSE]: 'Редактирование складов',
    [PermissionEnum.DELETE_WAREHOUSE]: 'Удаление складов',

    [PermissionEnum.CREATE_WAREHOUSE_STOCK]: 'Создание складских остатков',
    [PermissionEnum.READ_WAREHOUSE_STOCK]: 'Просмотр складских остатков',
    [PermissionEnum.UPDATE_WAREHOUSE_STOCK]: 'Редактирование складских остатков',
    [PermissionEnum.DELETE_WAREHOUSE_STOCK]: 'Удаление складских остатков',

    [PermissionEnum.CREATE_USER]: 'Создание пользователей',
    [PermissionEnum.READ_USER]: 'Просмотр пользователей',
    [PermissionEnum.UPDATE_USER]: 'Редактирование пользователей',
    [PermissionEnum.DELETE_USER]: 'Удаление пользователей',

    [PermissionEnum.CREATE_PERMISSION]: 'Создание разрешений',
    [PermissionEnum.READ_PERMISSION]: 'Просмотр разрешений',
    [PermissionEnum.UPDATE_PERMISSION]: 'Редактирование разрешений',
    [PermissionEnum.DELETE_PERMISSION]: 'Удаление разрешений',

    [PermissionEnum.HANDLE_USERS_PERMISSIONS]: 'Управление разрешениями пользователей',
    [PermissionEnum.HANDLE_USERS_ROLES]: 'Управление ролями пользователей',

    [PermissionEnum.CREATE_BANNER]: 'Создание баннеров',
    [PermissionEnum.READ_BANNER]: 'Просмотр баннеров',
    [PermissionEnum.UPDATE_BANNER]: 'Редактирование баннеров',
    [PermissionEnum.DELETE_BANNER]: 'Удаление баннеров',

    [PermissionEnum.CREATE_BANNER_CATEGORY]: 'Создание категорий баннеров',
    [PermissionEnum.READ_BANNER_CATEGORY]: 'Просмотр категорий баннеров',
    [PermissionEnum.UPDATE_BANNER_CATEGORY]: 'Редактирование категорий баннеров',
    [PermissionEnum.DELETE_BANNER_CATEGORY]: 'Удаление категорий баннеров'
  }

  return displayNames[permission] || permission
}

export default PermissionEnum
