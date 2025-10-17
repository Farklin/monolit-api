<?php

namespace App\Services\Warehouse;

use App\Dto\Warehouse\QueryWarehouseStrockDto;

class WarehouseService
{
    public function getWarehouseForCategory(QueryWarehouseStrockDto $dto)
    {
        $class = "App\Service\Warehouse\Strategy\Warehouse{$dto->strategy}Strategy";
        if (!class_exists($class)) {
            throw new \Exception('Invalid strategy');
        }
        $strategy = new $class();
        return $strategy->buildResponse($dto);
    }
}
