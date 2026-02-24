<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = [
        'name',
        'location',
        'phone',
    ];

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
}
