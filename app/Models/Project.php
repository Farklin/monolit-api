<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'key', 'description', 'status', 'priority'];

    public function contexts()
    {
        return $this->hasMany(Context::class);
    }
}
