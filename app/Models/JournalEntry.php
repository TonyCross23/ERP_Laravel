<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    protected $fillable = ['date', 'reference', 'description', 'journal_type'];

    public function items()
    {
        return $this->hasMany(JournalItem::class);
    }
}
