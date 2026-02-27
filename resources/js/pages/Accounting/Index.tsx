import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { BookOpen, Calendar, Hash, Info, ArrowRightLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Journal Entries', href: '/accounting/journals' },
];

export default function Index({ journals }: any) {

    // MMK Formatting Helper
    const formatMMK = (amount: number) => {
        return new Intl.NumberFormat('en-MM', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(amount) + " Ks";
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Journal Entries" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 overflow-y-auto text-foreground">

                {/* --- Header Section --- */}
                <div className="flex items-center justify-between bg-card p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">General Journal</h2>
                            <p className="text-xs text-muted-foreground italic">Double-entry accounting records</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold uppercase text-muted-foreground block">Total Entries</span>
                        <span className="text-lg font-black text-primary">{journals.length}</span>
                    </div>
                </div>

                {/* --- Journal Entries List --- */}
                <div className="grid grid-cols-1 gap-6">
                    {journals.length > 0 ? (
                        journals.map((entry: any) => (
                            <div key={entry.id} className="group rounded-xl border border-sidebar-border/70 bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all duration-300">

                                {/* Journal Header */}
                                <div className="bg-neutral-50/50 dark:bg-neutral-800/30 p-4 border-b dark:border-neutral-800 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            {new Date(entry.entry_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-black text-primary uppercase tracking-tighter">
                                            <Hash className="w-4 h-4" />
                                            {entry.reference}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                                        <Info className="w-4 h-4" />
                                        {entry.description}
                                    </div>
                                </div>

                                {/* Journal Items Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-neutral-50/30 dark:bg-neutral-900/40 text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b dark:border-neutral-800">
                                            <tr>
                                                <th className="p-4 text-left w-1/2">Account Details</th>
                                                <th className="p-4 text-right">Debit</th>
                                                <th className="p-4 text-right">Credit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-sidebar-border/30 dark:divide-neutral-800/50">
                                            {entry.items.map((item: any) => (
                                                <tr key={item.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-800/10 transition-colors">
                                                    <td className="p-4">
                                                        <div className={`flex items-center gap-3 ${item.credit > 0 ? 'ml-8 text-muted-foreground' : 'font-bold text-foreground'}`}>
                                                            <ArrowRightLeft className={`w-3.5 h-3.5 ${item.credit > 0 ? 'rotate-180 text-orange-400' : 'text-green-500'}`} />
                                                            <span>{item.account?.name}</span>
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-normal uppercase">
                                                                {item.account?.type}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right font-mono font-bold text-green-600 dark:text-green-400">
                                                        {item.debit > 0 ? formatMMK(item.debit) : '-'}
                                                    </td>
                                                    <td className="p-4 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                                                        {item.credit > 0 ? formatMMK(item.credit) : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {/* Entry Footer / Totals */}
                                        <tfoot className="bg-neutral-50/50 dark:bg-neutral-900/40 font-black border-t dark:border-neutral-800">
                                            <tr>
                                                <td className="p-4 text-right text-[10px] uppercase tracking-widest text-muted-foreground">Entry Total</td>
                                                <td className="p-4 text-right text-primary border-l dark:border-neutral-800">{formatMMK(entry.total_amount)}</td>
                                                <td className="p-4 text-right text-primary border-l dark:border-neutral-800">{formatMMK(entry.total_amount)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-xl border-2 border-dashed border-sidebar-border/70 text-muted-foreground">
                            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                            <p className="italic">မှတ်တမ်းတင်ထားသော Journal စာရင်းများ မရှိသေးပါ။</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}