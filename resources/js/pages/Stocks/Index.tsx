import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import { PlusCircle, PencilLine, XCircle, Save, Trash2, Package, Warehouse as WhIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Management', href: '/stocks' },
];

interface Stock {
    id: number;
    product_id: number;
    warehouse_id: number;
    product: { name: string };
    warehouse: { name: string };
    quantity: number;
}

export default function Index({ stocks, products, warehouses }: any) {
    const { props } = usePage();
    const flash = (props as any).flash;
    
    const [showToast, setShowToast] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        product_id: '',
        warehouse_id: '',
        quantity: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleEdit = (stock: Stock) => {
        clearErrors();
        setEditingId(stock.id);
        setData({
            product_id: String(stock.product_id),
            warehouse_id: String(stock.warehouse_id),
            quantity: String(stock.quantity),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setEditingId(null);
                clearErrors();
            },
        };

        if (editingId) {
            put(`/stocks/${editingId}`, options);
        } else {
            post('/stocks', options);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this stock record?')) {
            router.delete(`/stocks/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Management" />

            {/* --- Toast Message --- */}
            {showToast && flash?.success && (
                <div className="fixed top-5 right-5 z-[100] animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 bg-green-600 dark:bg-green-700 px-6 py-3 text-white shadow-2xl rounded-lg border border-green-500/50">
                        <span className="font-medium text-sm">{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 p-4 overflow-y-auto">
                
                {/* --- Form Section --- */}
                <div className={`shrink-0 rounded-xl border p-6 transition-all duration-300 ${
                    editingId 
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'border-sidebar-border/70 bg-card dark:bg-[#121212] shadow-sm'
                }`}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                            {editingId ? <PencilLine className="w-5 h-5 text-blue-500" /> : <Package className="w-5 h-5 text-primary" />}
                            {editingId ? 'Edit Stock Level' : 'Adjust Stock Level'}
                        </h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 uppercase transition-colors">
                                <XCircle className="w-4 h-4" /> Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Select Product</label>
                            <select 
                                value={data.product_id} 
                                onChange={e => setData('product_id', e.target.value)}
                                className={`h-10 w-full rounded-md border bg-background dark:bg-neutral-900 px-3 text-sm focus:ring-1 outline-none transition-all text-foreground ${
                                    errors.product_id ? 'border-red-500 ring-1 ring-red-500' : 'border-input dark:border-neutral-800 focus:ring-ring'
                                }`}
                            >
                                <option value="" className="dark:bg-neutral-900">Select Product</option>
                                {products.map((p: any) => <option key={p.id} value={p.id} className="dark:bg-neutral-900">{p.name}</option>)}
                            </select>
                            {errors.product_id && <p className="text-[11px] text-red-500 italic mt-1 font-medium">{errors.product_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Warehouse</label>
                            <select 
                                value={data.warehouse_id} 
                                onChange={e => setData('warehouse_id', e.target.value)}
                                className={`h-10 w-full rounded-md border bg-background dark:bg-neutral-900 px-3 text-sm focus:ring-1 outline-none transition-all text-foreground ${
                                    errors.warehouse_id ? 'border-red-500 ring-1 ring-red-500' : 'border-input dark:border-neutral-800 focus:ring-ring'
                                }`}
                            >
                                <option value="" className="dark:bg-neutral-900">Select Warehouse</option>
                                {warehouses.map((w: any) => <option key={w.id} value={w.id} className="dark:bg-neutral-900">{w.name}</option>)}
                            </select>
                            {errors.warehouse_id && <p className="text-[11px] text-red-500 italic mt-1 font-medium">{errors.warehouse_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Current Quantity</label>
                            <input
                                type="number"
                                value={data.quantity}
                                onChange={e => setData('quantity', e.target.value)}
                                className={`h-10 w-full rounded-md border bg-background dark:bg-neutral-900 px-3 text-sm focus:ring-1 outline-none transition-all text-foreground ${
                                    errors.quantity ? 'border-red-500 ring-1 ring-red-500' : 'border-input dark:border-neutral-800 focus:ring-ring'
                                }`}
                                placeholder="0"
                            />
                            {errors.quantity && <p className="text-[11px] text-red-500 italic mt-1 font-medium">{errors.quantity}</p>}
                        </div>

                        <div className="md:col-span-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full h-11 inline-flex items-center justify-center gap-2 rounded-md px-8 py-2 text-sm font-bold shadow-md transition-all active:scale-[0.98] ${
                                    editingId 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground dark:text-neutral-950'
                                } disabled:opacity-50`}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        {editingId ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                                        {editingId ? 'Update Stock Level' : 'Save Stock Record'}
                                    </>
                                )}
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
                                    <th className="p-4">Product Details</th>
                                    <th className="p-4">Warehouse</th>
                                    <th className="p-4 text-center">Stock Quantity</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50 dark:divide-neutral-800">
                                {stocks.length > 0 ? (
                                    stocks.map((stock: Stock) => (
                                        <tr key={stock.id} className={`group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors ${editingId === stock.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg group-hover:bg-white dark:group-hover:bg-neutral-700 transition-colors">
                                                        <Package className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="font-bold text-foreground">{stock.product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100 dark:border-blue-800/50">
                                                    <WhIcon className="w-3.5 h-3.5" />
                                                    {stock.warehouse.name}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-lg font-black ${stock.quantity <= 5 ? 'text-red-500' : 'text-foreground'}`}>
                                                    {stock.quantity}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => handleEdit(stock)} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-bold text-xs uppercase flex items-center gap-1">
                                                        <PencilLine className="w-3 h-3" /> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(stock.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs uppercase flex items-center gap-1">
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-10 text-center text-muted-foreground italic dark:text-neutral-500">No stock records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}