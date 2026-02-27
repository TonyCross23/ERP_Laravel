<?php

namespace App\Services;

use App\Contracts\Dao\PaymentDaoInterface;
use App\Contracts\Services\PaymentServiceInterface;
use App\Contracts\Services\AccountingServiceInterface;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class PaymentService implements PaymentServiceInterface
{
    protected $paymentDao, $accountingService;

    public function __construct(PaymentDaoInterface $paymentDao, AccountingServiceInterface $accountingService)
    {
        $this->paymentDao = $paymentDao;
        $this->accountingService = $accountingService;
    }

    public function collectPayment(array $data): object
    {
        return DB::transaction(function () use ($data) {
            // 1. Save Payment
            $payment = $this->paymentDao->createPayment($data);

            // 2. Update Invoice
            $invoice = Invoice::findOrFail($data['invoice_id']);
            $invoice->increment('amount_paid', $data['amount']);

            $status = ($invoice->amount_paid >= $invoice->total_amount) ? 'paid' : 'partial';
            $invoice->update(['status' => $status]);

            // 3. Trigger Accounting (Double Entry)
            $this->accountingService->recordPaymentAccounting($payment);

            return $payment;
        });
    }
}
