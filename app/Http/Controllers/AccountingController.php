<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Inertia\Inertia;

class AccountingController extends Controller
{
    public function index()
    {
        // Journal Entries တွေကို Items တွေ၊ Account တွေနဲ့တကွ ခေါ်ယူမယ်
        $journals = JournalEntry::with(['items.account'])
            ->latest()
            ->get();

        return Inertia::render('Accounting/Index', [
            'journals' => $journals
        ]);
    }
}
