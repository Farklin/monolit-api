<?php

namespace App\Dto\Warehouse;

/**
 * DTO для одного элемента склада в ответе
 */
class WarehouseStockItemDto
{
    public function __construct(
        public readonly string $warehouse_name,
        public readonly int $warehouse_id,
        public readonly int $quantity
    ) {
    }

    /**
     * Создает DTO из массива данных
     */
    public static function fromArray(array $data): self
    {
        return new self(
            warehouse_name: $data['warehouse_name'],
            warehouse_id: $data['warehouse_id'],
            quantity: $data['quantity']
        );
    }

    /**
     * Создает DTO из модели склада и количества
     */
    public static function fromWarehouse($warehouse, int $quantity): self
    {
        return new self(
            warehouse_name: $warehouse->name,
            warehouse_id: $warehouse->id,
            quantity: $quantity
        );
    }

    /**
     * Конвертирует DTO в массив
     */
    public function toArray(): array
    {
        return [
            'warehouse_name' => $this->warehouse_name,
            'warehouse_id' => $this->warehouse_id,
            'quantity' => $this->quantity,
        ];
    }
}

