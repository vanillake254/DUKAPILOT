'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Store, Package, AlertCircle, Star, LogOut, Users, MessageSquare } from 'lucide-react';
import { adminAPI } from '@/lib/api';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check admin auth
        const user = localStorage.getItem('user');
        const parsed = user ? JSON.parse(user) : null;
        if (!parsed || parsed.role !== 'SUPER_ADMIN') {
            router.push('/auth/admin');
            return;
        }
        loadStats();
    }, [router]);

    const loadStats = async () => {
        try {
            const response = await adminAPI.getDashboard();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/admin');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <p className="text-sm text-muted-foreground">BIASHARA 360 Platform Management</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Store className="w-6 h-6 text-primary" />
                            </div>
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Total Businesses</p>
                        <p className="text-3xl font-bold text-primary">{stats?.totalBusinesses || 0}</p>
                        <div className="flex gap-4 mt-2 text-xs">
                            <span className="text-green-600">Active: {stats?.activeBusinesses || 0}</span>
                            <span className="text-destructive">Suspended: {stats?.suspendedBusinesses || 0}</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-lg border border-secondary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-secondary/10">
                                <Package className="w-6 h-6 text-secondary" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-secondary">{stats?.totalProducts || 0}</p>
                        <p className="text-xs text-muted-foreground mt-2">Across all businesses</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
                        <p className="text-xs text-muted-foreground mt-2">Platform-wide</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-6 rounded-lg border border-yellow-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-yellow-500/10">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Pending Complaints</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats?.pendingComplaints || 0}</p>
                        <Link href="/admin/complaints" className="text-xs text-yellow-600 hover:underline mt-2 inline-block">
                            View all →
                        </Link>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 rounded-lg border border-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-purple-500/10">
                                <Star className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Reviews</p>
                        <p className="text-3xl font-bold text-purple-600">Moderate</p>
                        <Link href="/admin/reviews" className="text-xs text-purple-600 hover:underline mt-2 inline-block">
                            View all →
                        </Link>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-lg border border-green-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-green-500/10">
                                <MessageSquare className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Platform Health</p>
                        <p className="text-3xl font-bold text-green-600">Good</p>
                        <p className="text-xs text-muted-foreground mt-2">All systems operational</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/admin/businesses"
                            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Manage Businesses</p>
                                <p className="text-xs text-muted-foreground">View, suspend, activate</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/complaints"
                            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-yellow-500 hover:bg-yellow-500/5 transition-all"
                        >
                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Review Complaints</p>
                                <p className="text-xs text-muted-foreground">Moderate and resolve</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/reviews"
                            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-purple-500 hover:bg-purple-500/5 transition-all"
                        >
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                                <Star className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Moderate Reviews</p>
                                <p className="text-xs text-muted-foreground">Approve or reject</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
