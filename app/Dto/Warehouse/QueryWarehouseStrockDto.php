<?php

namespace App\Dto\Warehouse;

use App\Dto\Warehouse\Contract\DtoInterface;
use App\Http\Requests\Warehouse\Stock\GetWarehouseStockRequest;
use Illuminate\Http\Request;


class QueryWarehouseStrockDto implements DtoInterface
{
    public function __construct(public int $contextId, public int $categoryId, public string $strategy = 'base')
    {
    }

    public function toArray(): array
    {
        return [
            'strategy' => $this->strategy,
            'contextId' => $this->contextId,
            'categoryId' => $this->categoryId,
        ];
    }

    /**
     * Создает DTO из валидированного запроса
     * Валидация уже произошла в GetWarehouseStockRequest
     *
     * @param Request $request
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            contextId: $request->validated('context_id'),
            categoryId: $request->validated('category_id'),
            strategy: $request->validated('strategy')
        );
    }

}
