<?php

namespace App\Contracts\Dao;

interface ContactDaoInterface {
    public function getContacts(): object;
    public function contactCreate(array $data): object;
    public function getContactById(int $id): object;
}