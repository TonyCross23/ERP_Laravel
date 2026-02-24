<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['sku', 'name', 'purchase_price', 'selling_price'];

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    // Warehouse အားလုံးမှာရှိတဲ့ ပစ္စည်းလက်ကျန်စုစုပေါင်းကို သိချင်ရင်
    public function getTotalStockAttribute()
    {
        return $this->stocks()->sum('quantity');
    }
}
