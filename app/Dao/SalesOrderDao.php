<?php

namespace App\Dao;

use App\Models\SalesOrder;
use App\Contracts\Dao\SalesOrderDaoInterface;

class SalesOrderDao implements SalesOrderDaoInterface
{
    public function getSalesOrders(): object
    {
        return SalesOrder::with(['customer'])->latest()->get();
    }

    public function createSalesOrder(array $data): object
    {
        return SalesOrder::create($data);
    }

    public function generateOrderNumber(): string
    {
        $latest = SalesOrder::latest()->first();
        $number = $latest ? (int) substr($latest->order_no, 3) + 1 : 1;
        return 'SO-' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }

    public function getSalesOrderById(int $id): ?object
    {
        return SalesOrder::find($id);
    }

    public function deleteSalesOrder(int $id): bool
    {
        $order = SalesOrder::find($id);
        return $order ? $order->delete() : false;
    }
}
