<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = ['invoice_no', 'sales_order_id', 'total_amount', 'amount_paid', 'status'];

    public function lines()
    {
        return $this->hasMany(InvoiceLine::class);
    }
    public function sales_order()
    {
        return $this->belongsTo(SalesOrder::class, "sales_order_id");
    }
}
