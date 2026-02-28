<?php

namespace App\Contracts\Dao;

interface InvoiceDaoInterface
{
    public function createInvoice(array $data): object;
    public function generateInvoiceNumber(): string;
}
