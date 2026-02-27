<?php

namespace App\Services;

use App\Contracts\Dao\SalesOrderDaoInterface;
use App\Contracts\Dao\InvoiceDaoInterface;
use App\Contracts\Services\SalesOrderServiceInterface;
use App\Contracts\Services\StockServiceInterface;
use App\Models\SalesOrderLine;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;

class SalesOrderService implements SalesOrderServiceInterface
{
    protected $salesDao;
    protected $invoiceDao;
    protected $stockService;

    public function __construct(
        SalesOrderDaoInterface $salesDao,
        InvoiceDaoInterface $invoiceDao,
        StockServiceInterface $stockService
    ) {
        $this->salesDao = $salesDao;
        $this->invoiceDao = $invoiceDao;
        $this->stockService = $stockService;
    }

    public function getAllSales(): object
    {
        return $this->salesDao->getSalesOrders();
    }

    public function placeOrder(array $data): object
    {
        return DB::transaction(function () use ($data) {
            // ၁။ Sales Order သိမ်းခြင်း
            $order = $this->salesDao->createSalesOrder([
                'order_no'     => $this->salesDao->generateOrderNumber(),
                'customer_id'  => $data['customer_id'],
                'total_amount' => $data['total_amount'],
            ]);

            // ၂။ Line Details သိမ်းခြင်း
            SalesOrderLine::create([
                'sales_order_id' => $order->id,
                'product_id'     => $data['product_id'],
                'warehouse_id'   => $data['warehouse_id'],
                'quantity'       => $data['quantity'],
                'unit_price'     => $data['total_amount'] / $data['quantity'],
                'subtotal'       => $data['total_amount']
            ]);

            // ၃။ Stock နှုတ်ခြင်း
            $this->adjustStock($data['product_id'], $data['warehouse_id'], $data['quantity'], 'subtract');

            // ၄။ Invoice ထုတ်ခြင်း (total_amount မပါလို့ တက်တဲ့ error ပြင်ပြီး)
            $this->invoiceDao->createInvoice([
                'invoice_no'     => $this->invoiceDao->generateInvoiceNumber(),
                'sales_order_id' => $order->id,
                'total_amount'   => $data['total_amount'],
                'amount_paid'    => 0,
                'status'         => 'unpaid'
            ]);

            return $order;
        });
    }

    public function updateOrder(int $id, array $data): object
    {
        return DB::transaction(function () use ($id, $data) {
            $order = $this->salesDao->getSalesOrderById($id);

            // စတော့ဟောင်းကို အရင်ပြန်ပေါင်းထည့်
            $this->adjustStock($order->product_id, $order->warehouse_id, $order->quantity, 'add');

            // Order Update (Header)
            $order->update([
                'customer_id'  => $data['customer_id'],
                'total_amount' => $data['total_amount']
            ]);

            // Line Update (Single item logic အရ line ကို update လုပ်တာပါ)
            SalesOrderLine::where('sales_order_id', $id)->update([
                'product_id'   => $data['product_id'],
                'warehouse_id' => $data['warehouse_id'],
                'quantity'     => $data['quantity'],
                'unit_price'   => $data['total_amount'] / $data['quantity'],
                'subtotal'     => $data['total_amount']
            ]);

            // စတော့သစ်ကို ပြန်နှုတ်
            $this->adjustStock($data['product_id'], $data['warehouse_id'], $data['quantity'], 'subtract');

            return $order;
        });
    }

    public function deleteOrder(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $order = $this->salesDao->getSalesOrderById($id);
            // Stock ပြန်ပေါင်း
            $this->adjustStock($order->product_id, $order->warehouse_id, $order->quantity, 'add');

            \App\Models\Invoice::where('sales_order_id', $id)->delete();
            return $this->salesDao->deleteSalesOrder($id);
        });
    }

    private function adjustStock($productId, $warehouseId, $quantity, $type)
    {
        $stock = Stock::where('product_id', $productId)
            ->where('warehouse_id', $warehouseId)
            ->first();

        if ($stock) {
            $newQty = ($type === 'add') ? $stock->quantity + $quantity : $stock->quantity - $quantity;
            $this->stockService->stockSave([
                'product_id'   => $productId,
                'warehouse_id' => $warehouseId,
                'quantity'     => $newQty
            ]);
        }
    }
}
