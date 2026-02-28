import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import { Save, CreditCard, User, PencilLine, Trash2, X, FileText, Banknote, Calendar, History } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payments', href: '/payments' },
];

export default function Index({ payments, invoices }: any) {
    const { props } = usePage();
    const flash = (props as any).flash;
    const [showToast, setShowToast] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form Initialization
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        invoice_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        reference_no: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Edit Function - Table ထဲက data တွေကို form ထဲ ပြန်ထည့်ပေးတာပါ
    const handleEdit = (payment: any) => {
        setEditingId(payment.id);
        setData({
            invoice_id: String(payment.invoice_id || ''),
            amount: String(payment.amount || ''),
            payment_date: payment.payment_date,
            payment_method: payment.payment_method,
            reference_no: payment.reference_no || '',
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
            put(`/payments/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post('/payments', {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('ဒီ Payment စာရင်းကို ဖျက်မှာ သေချာပါသလား? Invoice Balance ပြန်တက်လာမှာ ဖြစ်ပါတယ်။')) {
            destroy(`/payments/${id}`, { preserveScroll: true });
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
            <Head title="Payment Management" />

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
                            <CreditCard className={`w-5 h-5 ${editingId ? 'text-blue-500' : 'text-primary'}`} />
                            {editingId ? `Editing Payment: #${editingId}` : 'Receive New Payment'}
                        </h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="text-xs text-red-500 hover:underline flex items-center gap-1 font-bold">
                                <X className="w-3 h-3" /> Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        {/* Invoice Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Select Invoice
                            </label>
                            <select
                                value={data.invoice_id}
                                onChange={e => setData('invoice_id', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="">Choose Invoice</option>
                                {invoices.map((inv: any) => (
                                    <option key={inv.id} value={String(inv.id)}>
                                        {inv.invoice_no} - {inv.sales_order?.customer?.name}
                                    </option>
                                ))}
                            </select>
                            {errors.invoice_id && <p className="text-[11px] text-red-500 italic mt-1">{errors.invoice_id}</p>}
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic flex items-center gap-1">
                                <Banknote className="w-3 h-3" /> Amount (MMK)
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Ks</div>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="0"
                                />
                            </div>
                            {errors.amount && <p className="text-[11px] text-red-500 italic mt-1">{errors.amount}</p>}
                        </div>

                        {/* Date Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Payment Date
                            </label>
                            <input
                                type="date"
                                value={data.payment_date}
                                onChange={e => setData('payment_date', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                            />
                            {errors.payment_date && <p className="text-[11px] text-red-500 italic mt-1">{errors.payment_date}</p>}
                        </div>

                        {/* Method Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Payment Method</label>
                            <select
                                value={data.payment_method}
                                onChange={e => setData('payment_method', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="Cash">Cash</option>
                                <option value="KPay">KPay</option>
                                <option value="CBPay">CBPay</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>

                        {/* Reference No */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground italic">Ref / Transaction ID</label>
                            <input
                                type="text"
                                value={data.reference_no}
                                onChange={e => setData('reference_no', e.target.value)}
                                className="h-10 w-full rounded-md border border-input dark:border-neutral-800 bg-background dark:bg-neutral-900 px-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Optional"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full h-11 inline-flex items-center justify-center gap-2 rounded-md px-8 py-2 text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-50 
                                ${editingId ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground dark:text-neutral-950'}`}
                            >
                                {processing ? 'Processing...' : <><Save className="w-4 h-4" /> {editingId ? 'Update Payment' : 'Post Payment Record'}</>}
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
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Invoice / Customer</th>
                                    <th className="p-4">Method</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50 dark:divide-neutral-800">
                                {payments.length > 0 ? (
                                    payments.map((p: any) => (
                                        <tr key={p.id} className={`group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors ${editingId === p.id ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}>
                                            <td className="p-4 text-muted-foreground font-medium">{p.payment_date}</td>
                                            <td className="p-4">
                                                <div className="font-black text-primary uppercase tracking-tighter">{p.invoice?.invoice_no}</div>
                                                <div className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                                                    <User className="w-3 h-3" /> {p.invoice?.sales_order?.customer?.name}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase">{p.payment_method}</span>
                                            </td>
                                            <td className="p-4 text-right font-black text-green-600 italic">
                                                {formatMMK(p.amount)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(p)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-md transition-colors">
                                                        <PencilLine className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-md transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="p-10 text-center text-muted-foreground italic">No payment records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}