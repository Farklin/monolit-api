<?php

namespace App\Services\Warehouse\Strategy;

use App\Models\WarehouseStock;
use App\Services\Warehouse\Contract\WarehouseStrategyInterface;
use App\Dto\Warehouse\QueryWarehouseStrockDto;
use App\Models\Warehouse;
use App\Dto\Warehouse\WarehouseStockItemDto;

class WarehouseBaseStrategy implements WarehouseStrategyInterface
{

    /**
     * @param QueryWarehouseStrockDto $dto
     * @return WarehouseStockItemDto[]
     */
    public function buildResponse(QueryWarehouseStrockDto $dto): array
    {
        //получить все склады контекста

        $warehouses = Warehouse::where('context_id', $dto->contextId)->get();
        $warehouseStocks = WarehouseStock::whereIn('warehouse_id', $warehouses->pluck('id'))
            ->where('category_id', $dto->categoryId)->get();

        $response = [];
        foreach ($warehouses as $warehouse) {
            $warehouseStock = $warehouseStocks->where('warehouse_id', $warehouse->id)->first();
            $quantity = empty($warehouseStock) ? 0 : rand($warehouseStock->min_quantity, $warehouseStock->max_quantity);

            $response[] = WarehouseStockItemDto::fromWarehouse($warehouse, $quantity);
        }

        return $response;
    }
}
