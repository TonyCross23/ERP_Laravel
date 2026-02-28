<?php

namespace App\Dao;

use App\Models\Payment;
use App\Contracts\Dao\PaymentDaoInterface;

class PaymentDao implements PaymentDaoInterface
{
    public function createPayment(array $data): object
    {
        return Payment::create($data);
    }

    public function getAllPayments()
    {
        return Payment::with('invoice.salesOrder.customer')->latest()->get();
    }
}
