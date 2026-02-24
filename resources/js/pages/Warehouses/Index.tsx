import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import { PlusCircle, PencilLine, XCircle, Save, Trash2, MapPin, Phone, Store } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Warehouse', href: '/warehouse' },
];

interface Warehouse {
    id: number;
    name: string;
    location: string;
    phone: string;
}

export default function Index({ warehouses }: { warehouses: Warehouse[] }) {
    const { props } = usePage();
    const flash = (props as any).flash; 
    
    const [showToast, setShowToast] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        location: '',
        phone: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleEdit = (warehouse: Warehouse) => {
        clearErrors();
        setEditingId(warehouse.id);
        setData({
            name: warehouse.name,
            location: warehouse.location || '',
            phone: warehouse.phone || '',
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
            put(`/warehouse/${editingId}`, options);
        } else {
            post('/warehouse', options);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this warehouse?')) {
            router.delete(`/warehouse/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouses" />

            {/* --- Toast Message --- */}
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
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                            {editingId ? <PencilLine className="w-5 h-5 text-blue-500" /> : <Store className="w-5 h-5 text-primary" />}
                            {editingId ? 'Edit Warehouse' : 'Add New Warehouse'}
                        </h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 uppercase">
                                <XCircle className="w-4 h-4" /> Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Warehouse Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`h-10 w-full rounded-md border bg-transparent px-3 text-sm focus:ring-1 outline-none transition-all ${
                                    errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-ring'
                                }`}
                                placeholder="Main Warehouse"
                            />
                            {errors.name && <p className="text-[11px] text-red-500 italic mt-1 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Phone Number</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:ring-1 outline-none focus:ring-ring"
                                placeholder="09xxxxxxx"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Location / Address</label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:ring-1 outline-none focus:ring-ring"
                                placeholder="No. 123, Street Name, Yangon"
                            />
                        </div>

                        <div className="md:col-span-2 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full h-11 inline-flex dark:text-taupe-950 items-center justify-center gap-2 rounded-md px-8 py-2 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] ${
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
                                        {editingId ? 'Update Warehouse' : 'Save Warehouse'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Table Section --- */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-card overflow-hidden dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b uppercase text-[11px] font-bold text-muted-foreground">
                                <tr>
                                    <th className="p-4">Warehouse Name</th>
                                    <th className="p-4">Contact Info</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {warehouses.length > 0 ? (
                                    warehouses.map((warehouse) => (
                                        <tr key={warehouse.id} className={`group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors ${editingId === warehouse.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                                            <td className="p-4 font-bold text-foreground">{warehouse.name}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="w-3 h-3" />
                                                    {warehouse.phone || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate max-w-[200px]">{warehouse.location || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(warehouse)} className="text-blue-500 hover:text-blue-700 font-bold text-xs uppercase flex items-center gap-1 transition-all">
                                                        <PencilLine className="w-3 h-3" /> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(warehouse.id)} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase flex items-center gap-1 transition-all">
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-10 text-center text-muted-foreground italic">No warehouses found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}