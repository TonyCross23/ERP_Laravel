<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = ['invoice_no', 'sales_order_id', 'amount_paid', 'status'];

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }
}
