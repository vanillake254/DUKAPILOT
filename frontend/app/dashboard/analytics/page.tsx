'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Package, DollarSign, ShoppingCart, BarChart } from 'lucide-react';
import { productsAPI, ordersAPI } from '@/lib/api';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const [inventoryRes, ordersRes] = await Promise.all([
                productsAPI.getInventorySummary(),
                ordersAPI.getStats(),
            ]);

            setStats({
                inventory: inventoryRes.data,
                orders: ordersRes.data,
            });
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { inventory, orders } = stats;

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Analytics & Insights</h1>
                <p className="text-muted-foreground mt-1">Track your business performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                            <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-primary">
                        KES {orders?.totalRevenue?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">From {orders?.totalOrders || 0} orders</p>
                </div>

                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-lg border border-secondary/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-secondary/10">
                            <Package className="w-6 h-6 text-secondary" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
                    <p className="text-3xl font-bold text-secondary">
                        KES {inventory?.totalValue?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{inventory?.totalProducts || 0} products</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                        <BarChart className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Active Orders</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {(orders?.pending || 0) + (orders?.confirmed || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {orders?.pending || 0} pending, {orders?.confirmed || 0} confirmed
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-500/10">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <BarChart className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Delivered Orders</p>
                    <p className="text-3xl font-bold text-green-600">{orders?.delivered || 0}</p>
                    <p className="text-xs text-muted-foreground mt-2">Successfully completed</p>
                </div>
            </div>

            {/* Inventory Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold mb-4">Inventory Health</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-muted-foreground">In Stock</span>
                                <span className="text-sm font-medium">
                                    {inventory?.totalProducts - (inventory?.outOfStock || 0) || 0} products
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all"
                                    style={{
                                        width: `${inventory?.totalProducts > 0
                                                ? ((inventory.totalProducts - (inventory.outOfStock || 0)) /
                                                    inventory.totalProducts) *
                                                100
                                                : 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-yellow-600">Low Stock</span>
                                <span className="text-sm font-medium text-yellow-600">
                                    {inventory?.lowStock || 0} products
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div
                                    className="bg-yellow-500 h-3 rounded-full transition-all"
                                    style={{
                                        width: `${inventory?.totalProducts > 0
                                                ? ((inventory.lowStock || 0) / inventory.totalProducts) * 100
                                                : 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-destructive">Out of Stock</span>
                                <span className="text-sm font-medium text-destructive">
                                    {inventory?.outOfStock || 0} products
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div
                                    className="bg-destructive h-3 rounded-full transition-all"
                                    style={{
                                        width: `${inventory?.totalProducts > 0
                                                ? ((inventory.outOfStock || 0) / inventory.totalProducts) * 100
                                                : 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold mb-4">Order Status Distribution</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Pending</span>
                                <span className="text-sm font-medium">{orders?.pending || 0}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div
                                    className="bg-yellow-500 h-3 rounded-full"
                                    style={{
                                        width: `${orders?.totalOrders > 0 ? ((orders.pending || 0) / orders.totalOrders) * 100 : 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Confirmed</span>
                                <span className="text-sm font-medium">{orders?.confirmed || 0}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div
                                    className="bg-blue-500 h-3 rounded-full"
                                    style={{
                                        width: `${orders?.totalOrders > 0 ? ((orders.confirmed || 0) / orders.totalOrders) * 100 : 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Delivered</span>
                                <span className="text-sm font-medium">{orders?.delivered || 0}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div
                                    className="bg-primary h-3 rounded-full"
                                    style={{
                                        width: `${orders?.totalOrders > 0 ? ((orders.delivered || 0) / orders.totalOrders) * 100 : 0
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">Quick Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Average Order Value</p>
                        <p className="text-2xl font-bold">
                            KES{' '}
                            {orders?.totalOrders > 0
                                ? Math.round(orders.totalRevenue / orders.totalOrders).toLocaleString()
                                : 0}
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Stock Turnover</p>
                        <p className="text-2xl font-bold">
                            {inventory?.totalProducts > 0
                                ? ((inventory.totalProducts - (inventory.outOfStock || 0)) /
                                    inventory.totalProducts *
                                    100
                                ).toFixed(1)
                                : 0}
                            %
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Fulfillment Rate</p>
                        <p className="text-2xl font-bold">
                            {orders?.totalOrders > 0
                                ? ((orders.delivered / orders.totalOrders) * 100).toFixed(1)
                                : 0}
                            %
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
