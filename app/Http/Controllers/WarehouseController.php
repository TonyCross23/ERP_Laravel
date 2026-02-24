<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Contracts\Services\WarehouseServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    private $warehouseService;

    public function __construct(WarehouseServiceInterface $warehouseService)
    {
        $this->warehouseService = $warehouseService;
    }

    public function index()
    {
        return Inertia::render('Warehouses/Index', [
            'warehouses' => $this->warehouseService->getWarehouses()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|max:255',
            'location' => 'nullable',
            'phone'    => 'nullable',
        ]);

        $this->warehouseService->warehouseCreate($data);
        return redirect()->back()->with('success', 'Warehouse created successfully! 🏢');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name'     => 'required|max:255',
            'location' => 'nullable',
            'phone'    => 'nullable',
        ]);

        $this->warehouseService->warehouseUpdate($id, $data);
        return redirect()->back()->with('success', 'Warehouse updated successfully! ✨');
    }

    public function destroy($id)
    {
        $this->warehouseService->warehouseDelete($id);
        return redirect()->back()->with('success', 'Warehouse deleted! 🗑️');
    }
}
