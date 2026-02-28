<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PaymentServiceInterface;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentServiceInterface $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index()
    {
        return inertia('Payments/Index', [
            'payments' => Payment::with('invoice.sales_order.customer')->latest()->get(),
            'invoices' => Invoice::with('sales_order.customer')->where('status', '!=', 'paid')->get()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'invoice_id' => 'required',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
            'payment_method' => 'required',
            'reference_no' => 'nullable'
        ]);

        $this->paymentService->collectPayment($data);
        return back()->with('success', 'Payment Successful!');
    }
}
