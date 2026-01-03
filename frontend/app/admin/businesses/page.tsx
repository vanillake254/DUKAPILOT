'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Ban, CheckCircle, Key } from 'lucide-react';
import { adminAPI } from '@/lib/api';

export default function BusinessesManagementPage() {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsed = user ? JSON.parse(user) : null;
        if (!parsed || parsed.role !== 'SUPER_ADMIN') {
            router.push('/auth/admin');
            return;
        }
        loadBusinesses();
    }, [router]);

    const loadBusinesses = async () => {
        try {
            const response = await adminAPI.getBusinesses();
            setBusinesses(response.data);
        } catch (error) {
            console.error('Failed to load businesses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this business?`)) return;

        try {
            await adminAPI.updateBusinessStatus(id, status);
            loadBusinesses();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handlePasswordReset = async (id: string, businessName: string) => {
        if (!confirm(`Reset password to "00000000" for ${businessName}?`)) return;

        try {
            await adminAPI.resetPassword(id);
            alert('Password reset successfully. New password: 00000000');
        } catch (error) {
            console.error('Failed to reset password:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xlfont-bold">Business Management</h1>
                    <p className="text-muted-foreground mt-1">Manage all registered businesses</p>
                </div>

                {/* Businesses Table */}
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Business</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Contact</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Products</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Orders</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Registered</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {businesses.map((business) => (
                                    <tr key={business.id} className="border-b border-border hover:bg-muted/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Store className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{business.businessName}</p>
                                                    <p className="text-xs text-muted-foreground">ID: {business.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm">{business.businessEmail}</p>
                                            <p className="text-xs text-muted-foreground">{business.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium">{business._count?.products || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium">{business._count?.orders || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full border ${business.status === 'ACTIVE'
                                                        ? 'bg-primary/10 text-primary border-primary/20'
                                                        : business.status === 'SUSPENDED'
                                                            ? 'bg-destructive/10 text-destructive border-destructive/20'
                                                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                                                    }`}
                                            >
                                                {business.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm">{new Date(business.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {business.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={() => handleStatusUpdate(business.id, 'SUSPENDED')}
                                                        className="p-2 rounded hover:bg-destructive/10 text-destructive"
                                                        title="Suspend"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusUpdate(business.id, 'ACTIVE')}
                                                        className="p-2 rounded hover:bg-primary/10 text-primary"
                                                        title="Activate"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handlePasswordReset(business.id, business.businessName)}
                                                    className="p-2 rounded hover:bg-yellow-500/10 text-yellow-600"
                                                    title="Reset Password"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
