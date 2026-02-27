<?php

namespace App\Contracts\Services;

interface PaymentServiceInterface
{
    public function collectPayment(array $data): object;
}
