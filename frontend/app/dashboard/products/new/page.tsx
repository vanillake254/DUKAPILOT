'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { productsAPI } from '@/lib/api';

export default function NewProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        cost: '',
        quantityBought: '',
        isPublished: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await productsAPI.create({
                ...formData,
                price: parseFloat(formData.price),
                cost: parseFloat(formData.cost),
                quantityBought: parseInt(formData.quantityBought),
            });

            router.push('/dashboard/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create product');
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
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-muted-foreground mt-1">Create a new inventory item</p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-6">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Product Name <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g., Laptop HP Pavilion"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Product description..."
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                            Category <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="category"
                            type="text"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g., Electronics"
                        />
                    </div>

                    {/* Price & Cost */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-2">
                                Selling Price (KES) <span className="text-destructive">*</span>
                            </label>
                            <input
                                id="price"
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="1500"
                            />
                        </div>

                        <div>
                            <label htmlFor="cost" className="block text-sm font-medium mb-2">
                                Cost Price (KES) <span className="text-destructive">*</span>
                            </label>
                            <input
                                id="cost"
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="1000"
                            />
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                            Quantity Bought <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            required
                            min="1"
                            value={formData.quantityBought}
                            onChange={(e) => setFormData({ ...formData, quantityBought: e.target.value })}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="50"
                        />
                    </div>

                    {/* Published Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            id="isPublished"
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                        />
                        <label htmlFor="isPublished" className="text-sm font-medium">
                            Publish to marketplace
                        </label>
                    </div>

                    {/* Profit Margin Indicator */}
                    {formData.price && formData.cost && (
                        <div className="p-4 rounded-lg bg-muted border border-border">
                            <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                            <p className="text-2xl font-bold text-primary">
                                {((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.cost) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Profit per unit: KES {(parseFloat(formData.price) - parseFloat(formData.cost)).toFixed(2)}
                            </p>
                        </div>
                    )}

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
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Product'}
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
