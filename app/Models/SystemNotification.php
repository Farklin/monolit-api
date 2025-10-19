<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class SystemNotification extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'message', 'type', 'user_id', 'read'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
