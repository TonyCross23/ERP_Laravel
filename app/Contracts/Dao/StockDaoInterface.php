<?php

namespace App\Contracts\Dao;

interface StockDaoInterface
{
    public function getStocks(): object;
    public function stockUpdateOrCreate(array $data): object;
    public function stockDelete(int $id): bool;
}
