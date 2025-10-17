<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseStock extends Model
{
    use HasFactory;

    protected $fillable = ['warehouse_id', 'category_id', 'max_quantity', 'min_quantity'];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
