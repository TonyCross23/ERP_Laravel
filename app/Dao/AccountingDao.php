<?php

namespace App\Dao;

use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalItem;
use App\Contracts\Dao\AccountingDaoInterface;

class AccountingDao implements AccountingDaoInterface
{
    public function createJournalEntry(array $data): object
    {
        return JournalEntry::create($data);
    }

    public function createJournalItem(array $data): object
    {
        return JournalItem::create($data);
    }

    public function getAccountByName(string $name): ?object
    {
        return Account::where('name', 'like', "%{$name}%")->first();
    }

    public function updateBalance(int $accountId, float $amount): bool
    {
        $account = Account::find($accountId);
        if ($account) {
            $account->balance += $amount;
            return $account->save();
        }
        return false;
    }
}
