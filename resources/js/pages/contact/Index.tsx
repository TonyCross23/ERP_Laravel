import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent } from 'react';

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
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'customer' as 'customer' | 'supplier',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/contacts', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 overflow-y-auto">

                {/* --- Form Section --- */}
                <div className="shrink-0 rounded-xl border border-sidebar-border/70 p-6 bg-card dark:bg-neutral-900">
                    <h2 className="text-lg font-semibold mb-4">Create Contact</h2>
                    <form onSubmit={submit} className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${errors.name ? 'border-red-500' : ''}`}
                            />
                            <div className="min-h-[20px]">
                                {errors.name && <p className="text-xs text-red-500 italic">{errors.name}</p>}
                            </div>
                        </div>

                        <div className="w-full md:w-48 space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value as any)}
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring dark:bg-neutral-900"
                            >
                                <option value="customer" className="text-black dark:text-white dark:bg-neutral-800">Customer</option>
                                <option value="supplier" className="text-black dark:text-white dark:bg-neutral-800">Supplier</option>
                            </select>
                            <div className="min-h-[20px]"></div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-7 h-9 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 shrink-0"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                </div>

                {/* --- Table Section --- */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-card overflow-hidden dark:bg-neutral-900">
                    <div className="overflow-x-auto h-full">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b sticky top-0">
                                <tr>
                                    <th className="p-4 font-semibold text-left">Name</th>
                                    <th className="p-4 font-semibold text-left">Type</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {contacts.data.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="p-4 font-medium">{contact.name}</td>
                                        <td className="p-4 capitalize text-muted-foreground">{contact.type}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure?')) router.delete(`/contacts/${contact.id}`)
                                                }}
                                                className="text-red-500 hover:underline font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}