<?php

namespace App\Contracts\Dao;

interface PaymentDaoInterface
{
    public function createPayment(array $data): object;
    public function getAllPayments();
}
