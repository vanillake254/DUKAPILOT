'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';

export default function CustomersPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Customers</h1>
                        <p className="text-muted-foreground mt-1">Manage your customer records</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-card p-10 rounded-lg border border-border text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Customers module</h2>
                    <p className="text-sm text-muted-foreground">
                        This page is ready for customer management. Customer profiles and order history views
                        can be added next.
                    </p>
                </div>
            </div>
        </div>
    );
}
