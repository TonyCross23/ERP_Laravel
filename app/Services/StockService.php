<?php

namespace App\Services;

use App\Contracts\Dao\StockDaoInterface;
use App\Contracts\Services\StockServiceInterface;

class StockService implements StockServiceInterface
{
    private $stockDao;

    public function __construct(StockDaoInterface $stockDao)
    {
        $this->stockDao = $stockDao;
    }

    public function getStocks(): object
    {
        return $this->stockDao->getStocks();
    }

    public function stockSave(array $data): object
    {
        return $this->stockDao->stockUpdateOrCreate($data);
    }

    public function stockDelete(int $id): bool
    {
        return $this->stockDao->stockDelete($id);
    }
}
