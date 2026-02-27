import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import { Save, ShoppingCart, User, PencilLine, Trash2, X, Package, Warehouse as WhIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Sales Orders', href: '/sales' },
];

export default function Index({ sales, customers, products, warehouses }: any) {
    const { props } = usePage();
    const flash = (props as any).flash;
    const [showToast, setShowToast] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form Initialization
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        customer_id: '',
        product_id: '',
        warehouse_id: '',
        quantity: '',
        total_amount: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Edit Function - Table ထဲက data တွေကို line ထဲကနေ ဆွဲထုတ်ပြီး form ထဲ ပြန်ထည့်ပေးတာပါ
    const handleEdit = (order: any) => {
        const line = order.lines?.[0]; // Header-Line relationship အရ ပထမဆုံး line ကို ယူတယ်
        setEditingId(order.id);
        setData({
            customer_id: String(order.customer_id || ''),
            product_id: String(line?.product_id || ''),
            warehouse_id: String(line?.warehouse_id || ''),
            quantity: String(line?.quantity || ''),
            total_amount: String(order.total_amount || ''),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/sales/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post('/sales', {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('ဒီ Order ကို ဖျက်မှာ သေချာပါသလား? စတော့များ ပြန်ပေါင်းပေးမှာ ဖြစ်ပါတယ်။')) {
            destroy(`/sales/${id}`, { preserveScroll: true });
        }
    };

    // MMK Formatting Helper
    const formatMMK = (amount: number) => {
        return new Intl.NumberFormat('en-MM', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(amount) + " Ks";
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Management" />

            {/* Notifications */}
            {showToast && flash?.success && (
                <div className="fixed top-5 right-5 z-[100] animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 bg-green-600 px-6 py-3 text-white shadow-2xl rounded-lg border border-green-500/50">
                        <span className="font-medium text-sm">{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 p-4 overflow-y-auto text-foreground">

                {/* --- Input Form Section --- */}
                <div className={`shrink-0 rounded-xl border transition-all duration-300 ${editingId ? 'border-blue-500 bg-blue-50/5 dark:bg-blue-900/5' : 'border-sidebar-border/70 bg-card'} p-6 shadow-sm`}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <ShoppingCart className={`w-5 h-5 ${editingId ? 'text-blue-500' : 'text-primary'}`} />
                            {editingId ? `Editing Order: #${editingId}` : 'Create New Sales Order'}
                        </h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="text-xs text-red-500 hover:underline flex items-center gap-1 font-bold">
                                <X className="w-3 h-3" /> Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        {/* Customer Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic flex items-center gap-1">
                                <User className="w-3 h-3" /> Customer
                            </label>
                            <select
                                value={data.customer_id}
                                onChange={e => setData('customer_id', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="">Select Customer</option>
                                {customers.map((c: any) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                            </select>
                            {errors.customer_id && <p className="text-[11px] text-red-500 italic mt-1">{errors.customer_id}</p>}
                        </div>

                        {/* Product Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic flex items-center gap-1">
                                <Package className="w-3 h-3" /> Product
                            </label>
                            <select
                                value={data.product_id}
                                onChange={e => setData('product_id', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="">Select Product</option>
                                {products.map((p: any) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                            </select>
                            {errors.product_id && <p className="text-[11px] text-red-500 italic mt-1">{errors.product_id}</p>}
                        </div>

                        {/* Warehouse Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic flex items-center gap-1">
                                <WhIcon className="w-3 h-3" /> Warehouse
                            </label>
                            <select
                                value={data.warehouse_id}
                                onChange={e => setData('warehouse_id', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses.map((w: any) => <option key={w.id} value={String(w.id)}>{w.name}</option>)}
                            </select>
                            {errors.warehouse_id && <p className="text-[11px] text-red-500 italic mt-1">{errors.warehouse_id}</p>}
                        </div>

                        {/* Quantity Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Quantity</label>
                            <input
                                type="number"
                                value={data.quantity}
                                onChange={e => setData('quantity', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                                placeholder="0"
                            />
                            {errors.quantity && <p className="text-[11px] text-red-500 italic mt-1">{errors.quantity}</p>}
                        </div>

                        {/* Total Amount Input (MMK) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Total Amount (MMK)</label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Ks</div>
                                <input
                                    type="number"
                                    value={data.total_amount}
                                    onChange={e => setData('total_amount', e.target.value)}
                                    className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="0"
                                />
                            </div>
                            {errors.total_amount && <p className="text-[11px] text-red-500 italic mt-1">{errors.total_amount}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full h-11 inline-flex items-center justify-center gap-2 rounded-md px-8 py-2 text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-50 
                                ${editingId ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground dark:text-neutral-950'}`}
                            >
                                {processing ? 'Processing...' : <><Save className="w-4 h-4" /> {editingId ? 'Update Order' : 'Complete Sale'}</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Table Section --- */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-card dark:bg-[#121212] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/40 border-b dark:border-neutral-800 uppercase text-[11px] font-bold text-muted-foreground">
                                <tr>
                                    <th className="p-4">Order No.</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Product Details</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50 dark:divide-neutral-800">
                                {sales.length > 0 ? (
                                    sales.map((order: any) => (
                                        <tr key={order.id} className={`group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors ${editingId === order.id ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}>
                                            <td className="p-4 font-black text-primary uppercase tracking-tighter">{order.order_no}</td>
                                            <td className="p-4">
                                                <div className="font-medium flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {order.customer?.name}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {order.lines?.[0] ? (
                                                    <div className="text-xs space-y-0.5">
                                                        <div className="font-bold flex items-center gap-1 text-foreground">
                                                            <Package className="w-3 h-3" /> {order.lines[0].product?.name}
                                                        </div>
                                                        <div className="text-muted-foreground flex items-center gap-1 italic">
                                                            Qty: {order.lines[0].quantity} | <WhIcon className="w-3 h-3" /> {order.lines[0].warehouse?.name}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-red-400 italic text-[10px]">No details found</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right font-bold text-foreground">
                                                {formatMMK(order.total_amount)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(order)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-md transition-colors">
                                                        <PencilLine className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(order.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-md transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="p-10 text-center text-muted-foreground italic">No sales recorded yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}