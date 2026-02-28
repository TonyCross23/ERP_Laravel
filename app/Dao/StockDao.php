<?php

namespace App\Dao;

use App\Models\Stock;
use App\Contracts\Dao\StockDaoInterface;

class StockDao implements StockDaoInterface
{
    public function getStocks(): object
    {
        return Stock::with(['product', 'warehouse'])->latest()->get();
    }

    public function stockUpdateOrCreate(array $data): object
    {
        return Stock::updateOrCreate(
            [
                'product_id'   => $data['product_id'],
                'warehouse_id' => $data['warehouse_id']
            ],
            [
                'quantity' => $data['quantity']
            ]
        );
    }

    public function stockDelete(int $id): bool
    {
        $stock = Stock::find($id);
        return $stock ? $stock->delete() : false;
    }
}
