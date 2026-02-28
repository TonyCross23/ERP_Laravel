<?php

namespace App\Services;

use App\Contracts\Dao\ProductDaoInterface;
use App\Contracts\Services\ProductServiceInterface;

class ProductService implements ProductServiceInterface
{
    private $productDao;

    public function __construct(ProductDaoInterface $productDao)
    {
        $this->productDao = $productDao;
    }

    public function getProducts(): object
    {
        return $this->productDao->getProducts();
    }

    public function productCreate(array $data): object
    {
        return $this->productDao->productCreate($data);
    }

    public function productDelete(int $id): bool
    {
        return $this->productDao->productDelete($id);
    }

    public function productUpdate(int $id, array $data): bool
    {
        return $this->productDao->productUpdate($id, $data);
    }
}
