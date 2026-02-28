<?php

namespace App\Services;

use App\Contracts\Dao\WarehouseDaoInterface;
use App\Contracts\Services\WarehouseServiceInterface;

class WarehouseService implements WarehouseServiceInterface
{
    private $warehouseDao;

    public function __construct(WarehouseDaoInterface $warehouseDao)
    {
        $this->warehouseDao = $warehouseDao;
    }

    public function getWarehouses(): object
    {
        return $this->warehouseDao->getWarehouses();
    }

    public function warehouseCreate(array $data): object
    {
        return $this->warehouseDao->warehouseCreate($data);
    }

    public function warehouseUpdate(int $id, array $data): bool
    {
        return $this->warehouseDao->warehouseUpdate($id, $data);
    }

    public function warehouseDelete(int $id): bool
    {
        return $this->warehouseDao->warehouseDelete($id);
    }
}
