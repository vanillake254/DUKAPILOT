'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { productsAPI } from '@/lib/api';

export default function BulkProductPage() {
    const router = useRouter();
    const [items, setItems] = useState([
        { name: '', quantityBought: '', totalCost: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addRow = () => {
        setItems([...items, { name: '', quantityBought: '', totalCost: '' }]);
    };

    const removeRow = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = items
                .filter(item => item.name && item.quantityBought && item.totalCost)
                .map(item => ({
                    name: item.name,
                    quantityBought: parseInt(item.quantityBought),
                    totalCost: parseFloat(item.totalCost),
                }));

            if (payload.length === 0) {
                setError('Please add at least one product');
                setLoading(false);
                return;
            }

            await productsAPI.bulkOnboard(payload);
            router.push('/dashboard/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to bulk onboard products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard/products"
                    className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Bulk Onboard Products</h1>
                    <p className="text-muted-foreground mt-1">Quick entry: Name, Quantity, Total Cost</p>
                </div>
            </div>

            {/* Info Card */}
            <div className="max-w-4xl mb-6">
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                    <p className="text-sm">
                        <strong>How it works:</strong> Enter product name, quantity bought, and total cost.
                        The system will automatically calculate unit cost and apply a 30% markup for the selling price.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card p-6 rounded-lg border border-border">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 mb-4 pb-4 border-b border-border">
                            <div className="col-span-5">
                                <p className="text-sm font-medium">Product Name</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-sm font-medium">Quantity Bought</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-sm font-medium">Total Cost (KES)</p>
                            </div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Rows */}
                        <div className="space-y-3">
                            {items.map((item, index) => {
                                const unitCost = item.quantityBought && item.totalCost
                                    ? parseFloat(item.totalCost) / parseInt(item.quantityBought)
                                    : 0;
                                const sellingPrice = unitCost * 1.3;

                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="grid grid-cols-12 gap-4 items-start">
                                            <div className="col-span-5">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => updateRow(index, 'name', e.target.value)}
                                                    placeholder="Product name"
                                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantityBought}
                                                    onChange={(e) => updateRow(index, 'quantityBought', e.target.value)}
                                                    placeholder="50"
                                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.totalCost}
                                                    onChange={(e) => updateRow(index, 'totalCost', e.target.value)}
                                                    placeholder="50000"
                                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div className="col-span-1 flex items-center">
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(index)}
                                                        className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Auto-calculated values */}
                                        {unitCost > 0 && (
                                            <div className="grid grid-cols-12 gap-4 pl-4">
                                                <div className="col-span-5 text-xs text-muted-foreground">
                                                    Auto-calculation →
                                                </div>
                                                <div className="col-span-3 text-xs">
                                                    <span className="text-muted-foreground">Unit Cost: </span>
                                                    <span className="font-medium">KES {unitCost.toFixed(2)}</span>
                                                </div>
                                                <div className="col-span-3 text-xs">
                                                    <span className="text-muted-foreground">Price: </span>
                                                    <span className="font-medium text-primary">KES {sellingPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Row Button */}
                        <button
                            type="button"
                            onClick={addRow}
                            className="mt-4 text-primary hover:underline text-sm font-medium"
                        >
                            + Add another product
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            {loading ? 'Uploading...' : `Onboard ${items.filter(i => i.name).length} Products`}
                        </button>
                        <Link
                            href="/dashboard/products"
                            className="px-6 py-3 rounded-md border border-border hover:bg-muted transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
