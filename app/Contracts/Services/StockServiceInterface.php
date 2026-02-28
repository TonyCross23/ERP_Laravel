<?php

namespace App\Contracts\Services;

interface StockServiceInterface
{
    public function getStocks(): object;
    public function stockSave(array $data): object;
    public function stockDelete(int $id): bool;
}
