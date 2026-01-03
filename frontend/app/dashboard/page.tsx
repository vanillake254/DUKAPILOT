'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { productsAPI } from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await productsAPI.getInventorySummary();
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
        router.push('/auth/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Package, label: 'Products', href: '/dashboard/products' },
        { icon: ShoppingCart, label: 'Orders', href: '/dashboard/orders' },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
        { icon: Users, label: 'Customers', href: '/dashboard/customers' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-primary">BIASHARA 360</h2>
                        <p className="text-xs text-muted-foreground mt-1">{user?.businessName}</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="bg-card border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium">{user?.businessName}</p>
                                <p className="text-xs text-muted-foreground">{user?.businessEmail}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-card p-6 rounded-lg border border-border card-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
                            <p className="text-xs text-muted-foreground mt-2">Inventory items</p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-border card-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Inventory Value</h3>
                                <BarChart3 className="w-5 h-5 text-secondary" />
                            </div>
                            <p className="text-3xl font-bold">
                                KES {stats?.totalValue?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">Total stock value</p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-border card-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Low Stock</h3>
                                <Package className="w-5 h-5 text-destructive" />
                            </div>
                            <p className="text-3xl font-bold text-destructive">{stats?.lowStock || 0}</p>
                            <p className="text-xs text-muted-foreground mt-2">Items need restocking</p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-border card-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Out of Stock</h3>
                                <ShoppingCart className="w-5 h-5 text-destructive" />
                            </div>
                            <p className="text-3xl font-bold text-destructive">{stats?.outOfStock || 0}</p>
                            <p className="text-xs text-muted-foreground mt-2">Requires immediate action</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-card p-6 rounded-lg border border-border card-shadow mb-8">
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link
                                href="/dashboard/products/new"
                                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Add Product</p>
                                    <p className="text-xs text-muted-foreground">Add new inventory item</p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/products/bulk"
                                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-secondary hover:bg-secondary/5 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Bulk Upload</p>
                                    <p className="text-xs text-muted-foreground">Import multiple products</p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/analytics"
                                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">View Analytics</p>
                                    <p className="text-xs text-muted-foreground">Sales & insights</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Products */}
                    {stats?.products && stats.products.length > 0 && (
                        <div className="bg-card p-6 rounded-lg border border-border card-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Recent Products</h2>
                                <Link href="/dashboard/products" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-border">
                                        <tr className="text-left text-sm text-muted-foreground">
                                            <th className="pb-3 font-medium">Product</th>
                                            <th className="pb-3 font-medium">Category</th>
                                            <th className="pb-3 font-medium">Price</th>
                                            <th className="pb-3 font-medium">Stock</th>
                                            <th className="pb-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.products.slice(0, 5).map((product: any) => (
                                            <tr key={product.id} className="border-b border-border last:border-0">
                                                <td className="py-3">
                                                    <p className="font-medium">{product.name}</p>
                                                </td>
                                                <td className="py-3 text-sm text-muted-foreground">{product.category}</td>
                                                <td className="py-3 font-medium">KES {Number(product.price).toLocaleString()}</td>
                                                <td className="py-3">
                                                    <span className={`text-sm ${product.quantityRemaining < 10 ? 'text-destructive font-semibold' : ''}`}>
                                                        {product.quantityRemaining}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {product.quantityRemaining === 0 ? (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive">
                                                            Out of Stock
                                                        </span>
                                                    ) : product.quantityRemaining < 10 ? (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-600">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                                            In Stock
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
