<?php

namespace App\Services;

use App\Contracts\Dao\AccountingDaoInterface;
use App\Contracts\Services\AccountingServiceInterface;
use Illuminate\Support\Facades\DB;

class AccountingService implements AccountingServiceInterface
{
    protected $accountingDao;

    public function __construct(AccountingDaoInterface $accountingDao)
    {
        $this->accountingDao = $accountingDao;
    }

    public function recordInvoiceAccounting(object $invoice): bool
    {
        return DB::transaction(function () use ($invoice) {
            // ၁။ Journal Entry (Header)
            $entry = $this->accountingDao->createJournalEntry([
                'entry_date'   => now(),
                'reference'    => $invoice->invoice_no,
                'description'  => "Invoice Recording: " . $invoice->invoice_no,
                'total_amount' => $invoice->total_amount
            ]);

            // ၂။ Accounts Receivable (Asset) - Debit(+)
            $arAccount = $this->accountingDao->getAccountByName('Receivable');
            $this->postToLedger($entry->id, $arAccount, $invoice->total_amount, 0);

            // ၃။ Sales Revenue (Revenue) - Credit(+)
            $salesAccount = $this->accountingDao->getAccountByName('Sales');
            $this->postToLedger($entry->id, $salesAccount, 0, $invoice->total_amount);

            return true;
        });
    }

    private function postToLedger($entryId, $account, $debit, $credit)
    {
        // Journal Item
        $this->accountingDao->createJournalItem([
            'journal_entry_id' => $entryId,
            'account_id'       => $account->id,
            'debit'            => $debit,
            'credit'           => $credit
        ]);

        // Balance Adjustment (Asset vs Revenue logic)
        $balanceChange = in_array($account->type, ['asset', 'expense'])
            ? ($debit - $credit)
            : ($credit - $debit);

        $this->accountingDao->updateBalance($account->id, $balanceChange);
    }

    public function recordPaymentAccounting(object $payment): bool
    {
        return true;
    }
}
