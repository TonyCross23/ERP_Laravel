import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contacts',
        href: '/contacts',
    },
];

interface Contact {
    id: number;
    name: string;
    type: 'customer' | 'supplier';
}

export default function Index({ contacts }: { contacts: { data: Contact[] } }) {
    // page props ထဲက flash ကို ယူမယ်၊ မရှိရင် object အလွတ်ပေးထားမယ်
    const { props } = usePage();
    const flash = (props as any).flash; 
    
    const [showToast, setShowToast] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'customer' as 'customer' | 'supplier',
    });

    // useEffect ထဲမှာ Optional Chaining (?.) သုံးပြီး စစ်မယ်
    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/contacts', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />

            {/* Notification Toast - flash?.success လို့ သုံးထားလို့ flash မရှိလည်း error မတက်တော့ပါဘူး */}
            {showToast && flash?.success && (
                <div className="fixed top-5 right-5 z-[100] animate-in fade-in slide-in-from-right-5 duration-300">
                    <div className="flex items-center gap-3 bg-green-600 px-6 py-3 text-white shadow-2xl rounded-lg border border-green-500">
                        <span className="text-xl font-bold">✓</span>
                        <span className="font-medium text-sm">{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 p-4 overflow-y-auto">
                {/* --- Form Section --- */}
                <div className="shrink-0 rounded-xl border border-sidebar-border/70 p-6 bg-card dark:bg-neutral-900 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Create New Contact</h2>
                    <form onSubmit={submit} className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Enter contact name"
                                className={`h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                            <div className="min-h-[18px]">
                                {errors.name && <p className="text-[11px] text-red-500 font-medium italic">{errors.name}</p>}
                            </div>
                        </div>

                        <div className="w-full md:w-56 space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Type</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value as any)}
                                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring dark:bg-neutral-900"
                            >
                                <option value="customer" className="text-black dark:text-white dark:bg-neutral-800">Customer</option>
                                <option value="supplier" className="text-black dark:text-white dark:bg-neutral-800">Supplier</option>
                            </select>
                            <div className="min-h-[18px]"></div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-[26px] h-10 inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 shrink-0"
                        >
                            {processing ? 'Saving...' : 'Save Contact'}
                        </button>
                    </form>
                </div>

                {/* --- Table Section --- */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-card overflow-hidden dark:bg-neutral-900 shadow-sm flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-left text-muted-foreground">Name</th>
                                    <th className="p-4 font-semibold text-left text-muted-foreground">Type</th>
                                    <th className="p-4 font-semibold text-right text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {contacts.data.length > 0 ? (
                                    contacts.data.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                                            <td className="p-4 font-medium">{contact.name}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${contact.type === 'customer'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                                        : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
                                                    }`}>
                                                    {contact.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this contact?')) {
                                                            router.delete(`/contacts/${contact.id}`);
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:underline font-semibold text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-10 text-center text-muted-foreground">
                                            No contacts found. Create one above!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}