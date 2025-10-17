<?php

namespace App\Services\Warehouse\Contract;

use App\Dto\Warehouse\QueryWarehouseStrockDto;

interface WarehouseStrategyInterface
{
    public function buildResponse(QueryWarehouseStrockDto $dto);
}
