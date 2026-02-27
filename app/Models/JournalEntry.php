<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    protected $fillable = ['entry_date', 'reference', 'description', 'total_amount'];

    public function items()
    {
        return $this->hasMany(JournalItem::class);
    }
}
