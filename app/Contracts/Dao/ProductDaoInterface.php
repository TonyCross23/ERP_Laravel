<?php
namespace App\Contracts\Dao;

interface ProductDaoInterface {
    public function getProducts(): object;
    public function productCreate(array $data): object;
    public function productDelete(int $id): bool;
    public function productUpdate(int $id, array $data): bool;
}