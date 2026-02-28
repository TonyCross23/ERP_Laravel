<?php

namespace App\Contracts\Dao;

interface WarehouseDaoInterface
{
    public function getWarehouses(): object;
    public function warehouseCreate(array $data): object;
    public function warehouseUpdate(int $id, array $data): bool;
    public function warehouseDelete(int $id): bool;
}
