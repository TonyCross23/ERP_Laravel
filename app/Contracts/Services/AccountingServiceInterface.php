<?php

namespace App\Contracts\Services;

interface AccountingServiceInterface
{
    public function recordInvoiceAccounting(object $invoice): bool;
    public function recordPaymentAccounting(object $payment): bool;
}
