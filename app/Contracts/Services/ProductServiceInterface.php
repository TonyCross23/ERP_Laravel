<?php

namespace App\Contracts\Services;

interface ProductServiceInterface
{
    public function getProducts(): object;
    public function productCreate(array $data): object;
    public function productDelete(int $id): bool;
    public function productUpdate(int $id, array $data): bool;
}
