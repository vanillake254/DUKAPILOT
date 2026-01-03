'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { productsAPI } from '@/lib/api';

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await productsAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground mt-1">Manage your inventory</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/products/bulk"
                        className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                    >
                        <Package className="w-4 h-4" />
                        Bulk Upload
                    </Link>
                    <Link
                        href="/dashboard/products/new"
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-lg border border-border mb-6">
                <div className="flex gap-4 flex-wrap">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                {filteredProducts.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No products found</h3>
                        <p className="text-muted-foreground mb-4">
                            {search || selectedCategory ? 'Try adjusting your filters' : 'Get started by adding your first product'}
                        </p>
                        <Link
                            href="/dashboard/products/new"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Product</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Cost</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Stock</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                {product.description && (
                                                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            KES {Number(product.price).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            KES {Number(product.cost).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${product.quantityRemaining < 10 ? 'text-destructive' : ''}`}>
                                                {product.quantityRemaining}
                                            </span>
                                            <span className="text-muted-foreground text-sm">
                                                {' '}/ {product.quantityBought}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
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
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/products/${product.id}`}
                                                className="text-primary hover:underline text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary */}
            {filteredProducts.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                    Showing {filteredProducts.length} of {products.length} products
                </div>
            )}
        </div>
    );
}
