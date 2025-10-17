<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'content', 'context_id', 'status', 'priority'];

    public function context()
    {
        return $this->belongsTo(Context::class);
    }
}
