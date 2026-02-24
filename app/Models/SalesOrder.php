<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesOrder extends Model
{
    protected $fillable = ['order_no', 'contact_id', 'total_amount'];

    public function customer()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
