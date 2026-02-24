<?php

namespace App\Contracts\Services;

interface ContactServiceInterface {
    public function getContacts(): object;
    public function contactCreate(array $data): object;
    public function contactDelete(int $id): bool;
}