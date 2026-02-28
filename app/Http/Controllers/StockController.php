<?php

namespace App\Http\Controllers;

use App\Contracts\Services\StockServiceInterface;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    private $stockService;

    public function __construct(StockServiceInterface $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index()
    {
        return Inertia::render('Stocks/Index', [
            'stocks'     => $this->stockService->getStocks(),
            'products'   => Product::all(),
            'warehouses' => Warehouse::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity'     => 'required|integer|min:0',
        ]);

        $this->stockService->stockSave($data);
        return redirect()->back()->with('success', 'Stock updated successfully! 📦');
    }

    public function update(Request $request, $id)
    {
        $data = $this->validateStock($request);

        $this->stockService->stockSave($data);

        return redirect()->back()->with('success', 'Stock updated successfully! ✨');
    }

    public function destroy($id)
    {
        $this->stockService->stockDelete($id);
        return redirect()->back()->with('success', 'Stock entry removed! 🗑️');
    }

    private function validateStock(Request $request)
    {
        return $request->validate([
            'product_id'   => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity'     => 'required|integer|min:0',
        ]);
    }   
}
