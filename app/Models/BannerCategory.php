<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BannerCategory extends Model
{
    protected $fillable = ['name', 'context_id', 'banner_id', 'type', 'category_id', 'priority'];

    public function context()
    {
        return $this->belongsTo(Context::class);
    }

    public function banner()
    {
        return $this->belongsTo(Banner::class);
    }
}
