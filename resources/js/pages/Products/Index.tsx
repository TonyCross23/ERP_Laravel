import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import { PlusCircle, PencilLine, XCircle, Save, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
];

interface Product {
    id: number;
    sku: string;
    name: string;
    purchase_price: string | number;
    selling_price: string | number;
}

export default function Index({ products }: { products: { data: Product[] } }) {
    const { props } = usePage();
    const flash = (props as any).flash; 
    
    const [showToast, setShowToast] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        sku: '',
        name: '',
        purchase_price: '',
        selling_price: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleEdit = (product: Product) => {
        clearErrors();
        setEditingId(product.id);
        setData({
            sku: product.sku,
            name: product.name,
            purchase_price: String(product.purchase_price),
            selling_price: String(product.selling_price),
        });
        // Edit နှိပ်ရင် form ဆီ scroll ဆွဲပေးမယ် (Optional)
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
            preserveScroll: true, // ပြဿနာကို ဖြေရှင်းပေးမယ့် အဓိက line ပါ
            onSuccess: () => {
                reset();
                setEditingId(null);
                clearErrors();
            },
        };

        if (editingId) {
            put(`/products/${editingId}`, options);
        } else {
            post('/products', options);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/products/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Success Toast */}
            {showToast && flash?.success && (
                <div className="fixed top-5 right-5 z-[100] animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 bg-green-600 px-6 py-3 text-white shadow-2xl rounded-lg border border-green-500">
                        <span className="font-medium text-sm">{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 p-4 overflow-y-auto">
                
                {/* --- Form Section --- */}
                <div className={`shrink-0 rounded-xl border p-6 transition-all duration-300 ${
                    editingId 
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' 
                    : 'border-sidebar-border/70 bg-card dark:bg-neutral-900 shadow-sm'
                }`}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            {editingId ? <PencilLine className="w-5 h-5 text-blue-500" /> : <PlusCircle className="w-5 h-5 text-primary" />}
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 uppercase">
                                <XCircle className="w-4 h-4" /> Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">SKU Code</label>
                            <input
                                type="text"
                                value={data.sku}
                                onChange={e => setData('sku', e.target.value)}
                                className={`h-10 w-full rounded-md border bg-transparent px-3 text-sm focus:ring-1 outline-none transition-all ${
                                    errors.sku ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-ring'
                                }`}
                                placeholder="PRO-001"
                            />
                            {errors.sku && <p className="text-[11px] text-red-500 italic mt-1 font-medium">{errors.sku}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Product Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`h-10 w-full rounded-md border bg-transparent px-3 text-sm focus:ring-1 outline-none transition-all ${
                                    errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-ring'
                                }`}
                                placeholder="iPhone 15 Pro"
                            />
                            {errors.name && <p className="text-[11px] text-red-500 italic mt-1 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Purchase Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.purchase_price}
                                onChange={e => setData('purchase_price', e.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:ring-1 outline-none focus:ring-ring"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Selling Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.selling_price}
                                onChange={e => setData('selling_price', e.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:ring-1 outline-none focus:ring-ring"
                                placeholder="0.00"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`md:col-span-4 h-11 inline-flex items-center justify-center gap-2 rounded-md px-8 py-2 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] ${
                                editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-primary/90'
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
                                    {editingId ? 'Update Product' : 'Save Product'}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* --- Table Section --- */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-card overflow-hidden dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b uppercase text-[11px] font-bold text-muted-foreground">
                                <tr>
                                    <th className="p-4">SKU</th>
                                    <th className="p-4">Product Name</th>
                                    <th className="p-4 text-right">Purchase</th>
                                    <th className="p-4 text-right">Selling</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {products.data.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className={`group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors ${editingId === product.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                                            <td className="p-4 font-mono text-[12px]">{product.sku}</td>
                                            <td className="p-4 font-medium">{product.name}</td>
                                            <td className="p-4 text-right">{product.purchase_price}</td>
                                            <td className="p-4 text-right">
                                                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">
                                                    {product.selling_price}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEdit(product)} 
                                                        className="text-blue-500 hover:text-blue-700 font-bold text-xs uppercase flex items-center gap-1"
                                                    >
                                                        <PencilLine className="w-3 h-3" /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(product.id)} 
                                                        className="text-red-500 hover:text-red-700 font-bold text-xs uppercase flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="p-10 text-center text-muted-foreground italic">No products found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}