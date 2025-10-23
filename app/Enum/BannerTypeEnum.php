<?php

namespace App\Enum;

enum BannerTypeEnum: string
{
    case DEFAULT = 'default';
    case MOBILE = 'mobile';
    case TABLET = 'tablet';
    case DESKTOP = 'desktop';
    case ALL = 'all';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
