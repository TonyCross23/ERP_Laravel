<?php

namespace App\Contracts\Dao;

interface SalesOrderDaoInterface
{
    public function getSalesOrders(): object;
    public function createSalesOrder(array $data): object;
    public function generateOrderNumber(): string;
    public function getSalesOrderById(int $id): ?object;
    public function deleteSalesOrder(int $id): bool;
}
