<?php

namespace App\Http\Controllers;

use App\Contracts\Services\SalesOrderServiceInterface;
use App\Models\Contact;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesOrderController extends Controller
{
    protected $salesService;

    public function __construct(SalesOrderServiceInterface $salesService)
    {
        $this->salesService = $salesService;
    }

    public function index()
    {
        // အရင်ကထက်စာရင် Relationship တွေပါ တစ်ခါတည်း ဆွဲခေါ်ထားတာ ပိုကောင်းပါတယ်
        // Lines နဲ့ Product တွေကိုပါ with() ထဲမှာ ထည့်ခေါ်လိုက်မယ်
        $sales = SalesOrder::with(['customer', 'lines.product', 'lines.warehouse'])
            ->latest()
            ->get();

        return Inertia::render('Sales/Index', [
            'sales'      => $sales,
            'customers'  => Contact::where('type', 'customer')->orWhere('type', 'both')->get(), // Customer သီးသန့်စစ်ထုတ်ရင် ပိုကောင်းတယ်
            'products'   => Product::all(),
            'warehouses' => Warehouse::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id'  => 'required|exists:contacts,id',
            'product_id'   => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity'     => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
        ]);

        // MMK အတွက် ဓာတ်သမကိန်းတွေ ရှုပ်မနေအောင် ညှိပေးလိုက်တာပါ
        $validated['total_amount'] = round($validated['total_amount']);

        try {
            $this->salesService->placeOrder($validated);
            return redirect()->back()->with('success', 'အရောင်းမှတ်တမ်းတင်ပြီး စတော့ညှိခြင်း အောင်မြင်သည်! 💰');
        } catch (\Exception $e) {
            // Error ဖြစ်ခဲ့ရင် သိသာအောင်
            return redirect()->back()->withErrors(['total_amount' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'customer_id'  => 'required|exists:contacts,id',
            'product_id'   => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity'     => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
        ]);

        $validated['total_amount'] = round($validated['total_amount']);

        try {
            $this->salesService->updateOrder($id, $validated);
            return redirect()->back()->with('success', 'အော်ဒါကို ပြန်ပြင်ပြီး စတော့ညှိပေးပြီးပါပြီ! ✨');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['total_amount' => 'Update Error: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $this->salesService->deleteOrder($id);
            return redirect()->back()->with('success', 'အော်ဒါဖျက်ပြီး စတော့များ ပြန်ပေါင်းပေးပြီးပါပြီ! 🗑️');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Delete Error: ' . $e->getMessage()]);
        }
    }
}
