<?php

namespace App\Contracts\Services;

interface SalesOrderServiceInterface
{
    public function getAllSales(): object;
    public function placeOrder(array $data): object;
    public function updateOrder(int $id, array $data): object;
    public function deleteOrder(int $id): bool;
}
