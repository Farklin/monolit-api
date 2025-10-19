<?php

namespace App\Enum;

enum NotificationTypeEnum: string
{
    case INFO = 'info';
    case SUCCESS = 'success';
    case WARNING = 'warning';
    case ERROR = 'error';


    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
