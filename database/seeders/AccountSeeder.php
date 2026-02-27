<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'code' => '1001',
                'name' => 'Cash on Hand',
                'type' => 'asset',
                'balance' => 0
            ],
            [
                'code' => '1200',
                'name' => 'Accounts Receivable',
                'type' => 'asset',
                'balance' => 0
            ],
            [
                'code' => '4001',
                'name' => 'Sales Revenue',
                'type' => 'revenue',
                'balance' => 0
            ],
            [
                'code' => '5001',
                'name' => 'Cost of Goods Sold',
                'type' => 'expense',
                'balance' => 0
            ]
        ];

        foreach ($accounts as $account) {
            Account::updateOrCreate(['code' => $account['code']], $account);
        }
    }
}
