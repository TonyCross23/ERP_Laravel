<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = ['po_number', 'supplier_id', 'total_amount', 'status'];

    public function supplier()
    {
        // Contact table ထဲက supplier type ရှိသူနဲ့ ချိတ်တာပါ
        return $this->belongsTo(Contact::class, 'supplier_id');
    }
}
