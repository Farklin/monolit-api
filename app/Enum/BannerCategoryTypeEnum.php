<?php

namespace App\Enum;

enum BannerCategoryTypeEnum: string
{
    case CATALOG = 'catalog';
    case PROMO = 'promo';


    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
