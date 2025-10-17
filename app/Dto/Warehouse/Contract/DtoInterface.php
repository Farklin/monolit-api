<?php

namespace App\Dto\Warehouse\Contract;

use Illuminate\Http\Request;

interface DtoInterface
{
    public function toArray(): array;

    public static function fromRequest(Request $request): self;
}
