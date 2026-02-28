<?php

namespace App\Http\Controllers\MasterData;

use Illuminate\Http\Request;
use App\Contracts\Services\ProductServiceInterface;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProductController extends Controller
{
    private $productService;

    public function __construct(ProductServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => $this->productService->getProducts()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sku' => 'required|unique:products,sku',
            'name' => 'required',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
        ]);

        $this->productService->productCreate($data);
        return redirect()->back()->with('success', 'Product created successfully! 📦');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'sku' => 'required|unique:products,sku,' . $id,
            'name' => 'required',
            'purchase_price' => 'required|numeric',
            'selling_price' => 'required|numeric',
        ]);

        $this->productService->productUpdate($id, $data);

        return redirect()->back()->with('success', 'Product updated successfully! ✨');
    }

    public function destroy($id)
    {
        $this->productService->productDelete($id);
        return redirect()->back()->with('success', 'Product deleted! 🗑️');
    }
}
