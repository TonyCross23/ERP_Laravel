<?php

namespace App\Contracts\Dao;

interface AccountingDaoInterface
{
    public function createJournalEntry(array $data): object;
    public function createJournalItem(array $data): object;
    public function getAccountByName(string $name): ?object;
    public function updateBalance(int $accountId, float $amount): bool;
}
