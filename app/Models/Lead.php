<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = ['contact_name', 'company', 'email', 'status'];

    // Lead တစ်ခုကနေ Customer ဖြစ်သွားခဲ့ရင် Contact နဲ့ ချိတ်နိုင်ဖို့ (Optional logic)
    public function convertedContact()
    {
        return $this->hasOne(Contact::class, 'email', 'email');
    }
}
