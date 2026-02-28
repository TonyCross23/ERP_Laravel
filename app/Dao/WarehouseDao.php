<?php

namespace App\Dao;

use App\Models\Warehouse;
use App\Contracts\Dao\WarehouseDaoInterface;

class WarehouseDao implements WarehouseDaoInterface
{
    public function getWarehouses(): object
    {
        return Warehouse::latest()->get();
    }

    public function warehouseCreate(array $data): object
    {
        return Warehouse::create([
            'name'     => $data['name'],
            'location' => $data['location'] ?? null,
            'phone'    => $data['phone'] ?? null,
        ]);
    }

    public function warehouseUpdate(int $id, array $data): bool
    {
        $warehouse = Warehouse::findOrFail($id);
        return $warehouse->update($data);
    }

    public function warehouseDelete(int $id): bool
    {
        $warehouse = Warehouse::findOrFail($id);
        return $warehouse->delete();
    }
}
