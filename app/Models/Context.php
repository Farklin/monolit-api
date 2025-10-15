<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Context extends Model
{
    protected $fillable = ['name', 'key', 'description', 'status', 'priority', 'project_id'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
