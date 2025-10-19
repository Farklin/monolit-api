<?php

namespace App\Enum;

enum PermissonEnum: string
{
    case CREATE_PROJECT = 'create_project';
    case READ_PROJECT = 'read_project';
    case UPDATE_PROJECT = 'update_project';
    case DELETE_PROJECT = 'delete_project';

    case CREATE_CONTEXT = 'create_context';
    case READ_CONTEXT = 'read_context';
    case UPDATE_CONTEXT = 'update_context';
    case DELETE_CONTEXT = 'delete_context';

    case CREATE_WAREHOUSE = 'create_warehouse';
    case READ_WAREHOUSE = 'read_warehouse';
    case UPDATE_WAREHOUSE = 'update_warehouse';
    case DELETE_WAREHOUSE = 'delete_warehouse';

    case CREATE_WAREHOUSE_STOCK = 'create_warehouse_stock';
    case READ_WAREHOUSE_STOCK = 'read_warehouse_stock';
    case UPDATE_WAREHOUSE_STOCK = 'update_warehouse_stock';
    case DELETE_WAREHOUSE_STOCK = 'delete_warehouse_stock';

    case CREATE_USER = 'create_user';
    case READ_USER = 'read_user';
    case UPDATE_USER = 'update_user';
    case DELETE_USER = 'delete_user';

    case CREATE_PERMISSION = 'create_permission';
    case READ_PERMISSION = 'read_permission';
    case UPDATE_PERMISSION = 'update_permission';
    case DELETE_PERMISSION = 'delete_permission';

    case CREATE_ROLE = 'create_role';
    case READ_ROLE = 'read_role';
    case UPDATE_ROLE = 'update_role';
    case DELETE_ROLE = 'delete_role';

    case SEND_NOTIFICATION = 'send_notification';
    case SEND_USER_NOTIFICATION = 'send_user_notification';

    case HANDLE_USERS_PERMISSIONS = 'handle_users_permissions';
    case HANDLE_USERS_ROLES = 'handle_users_roles';
}
