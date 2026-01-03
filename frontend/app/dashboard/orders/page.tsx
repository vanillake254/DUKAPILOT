'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, DollarSign } from 'lucide-react';
import { ordersAPI } from '@/lib/api';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadOrders();
        loadStats();
    }, [filter]);

    const loadOrders = async () => {
        try {
            const params = filter !== 'ALL' ? { status: filter } : undefined;
            const response = await ordersAPI.getAll(params);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await ordersAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            loadOrders();
            loadStats();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'CONFIRMED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'SHIPPED': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'DELIVERED': return 'bg-primary/10 text-primary border-primary/20';
            case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20';
            default: return 'bg-muted';
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
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground mt-1">Manage customer orders</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                        <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <p className="text-sm text-muted-foreground">Pending</p>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-muted-foreground">Confirmed</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-primary" />
                            <p className="text-sm text-muted-foreground">Delivered</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">{stats.delivered}</p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-secondary" />
                            <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                        <p className="text-2xl font-bold text-secondary">
                            KES {stats.totalRevenue?.toLocaleString() || 0}
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-card p-4 rounded-lg border border-border mb-6">
                <div className="flex gap-2 flex-wrap">
                    {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                {orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders found</h3>
                        <p className="text-muted-foreground">
                            {filter !== 'ALL' ? `No ${filter.toLowerCase()} orders` : 'No orders yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Order ID</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Customer</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Items</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Total</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Type</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-sm">#{order.id.slice(0, 8)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{order.customerName}</p>
                                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                                        </td>
                                        <td className="px-6 py-4">{order.items?.length || 0} items</td>
                                        <td className="px-6 py-4 font-semibold">
                                            KES {Number(order.totalAmount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-muted">
                                                {order.deliveryType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className="px-3 py-1 text-sm rounded border border-input bg-background"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
