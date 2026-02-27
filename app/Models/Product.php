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
    public function stockMoves()
    {
        return $this->hasMany(StockMove::class);
    }

    // လက်ရှိ Warehouse အားလုံးပေါင်း လက်ကျန်ကို တန်းခေါ်ဖို့
    public function getCurrentStockAttribute()
    {
        return $this->stocks()->sum('quantity');
    }
}
