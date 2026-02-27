<?php

namespace App\Dao;

use App\Models\Invoice;
use App\Contracts\Dao\InvoiceDaoInterface;

class InvoiceDao implements InvoiceDaoInterface
{
    public function createInvoice(array $data): object
    {
        return Invoice::create($data);
    }

    public function generateInvoiceNumber(): string
    {
        $latest = Invoice::latest()->first();
        $number = $latest ? (int) substr($latest->invoice_no, 4) + 1 : 1;
        return 'INV-' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }
}
