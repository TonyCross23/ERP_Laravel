<?php

namespace App\Dao;

use App\Models\Product;
use App\Contracts\Dao\ProductDaoInterface;

class ProductDao implements ProductDaoInterface
{
    /**
     * @return object
     */
    public function getProducts(): object
    {
        return Product::latest()->paginate(10);
    }

    /**
     * @param array $data
     * @return object
     */
    public function productCreate(array $data): object
    {
        return Product::create([
            'sku'            => $data['sku'],
            'name'           => $data['name'],
            'purchase_price' => $data['purchase_price'],
            'selling_price'  => $data['selling_price'],
        ]);
    }

    /**
     * @param int $id
     * @return bool
     */
    public function productDelete(int $id): bool
    {
        $product = Product::findOrFail($id);
        return $product->delete();
    }

    public function productUpdate(int $id, array $data): bool
    {
        $product = Product::findOrFail($id);
        return $product->update($data);
    }
}
