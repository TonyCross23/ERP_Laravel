<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceLine extends Model
{
    protected $fillable = ['invoice_id', 'product_id', 'quantity', 'unit_price', 'subtotal'];
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
