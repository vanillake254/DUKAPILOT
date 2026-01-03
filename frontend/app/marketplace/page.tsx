'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Store } from 'lucide-react';
import { marketplaceAPI } from '@/lib/api';

export default function MarketplacePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, [search]);

    const loadProducts = async () => {
        try {
            const params = search ? { search } : undefined;
            const response = await marketplaceAPI.getProducts(params);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to load products:', error);
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

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-secondary py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        BIASHARA 360 Marketplace
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Discover local businesses and products near you
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for products or businesses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-lg border-0 shadow-lg text-lg focus:ring-2 focus:ring-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">No products found</h3>
                        <p className="text-muted-foreground">
                            {search ? 'Try a different search term' : 'Check back later for new products'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Available Products</h2>
                            <p className="text-muted-foreground">{products.length} products</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product: any) => (
                                <div
                                    key={product.id}
                                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Product Image Placeholder */}
                                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                        <Store className="w-16 h-16 text-primary/30" />
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                                        {product.description && (
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-2xl font-bold text-primary">
                                                KES {Number(product.price).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Business Info */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Store className="w-4 h-4" />
                                            <span className="line-clamp-1">{product.business?.businessName}</span>
                                        </div>

                                        {/* Location */}
                                        {product.business?.locationAddress && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                                <MapPin className="w-4 h-4" />
                                                <span className="line-clamp-1">{product.business.locationAddress}</span>
                                            </div>
                                        )}

                                        {/* Distance (if calculated) */}
                                        {product.distance !== null && product.distance !== undefined && (
                                            <div className="text-xs text-primary mb-3">
                                                📍 {product.distance.toFixed(1)} km away
                                            </div>
                                        )}

                                        {/* Stock Status */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {product.quantityRemaining} in stock
                                            </span>
                                            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                                {product.category}
                                            </span>
                                        </div>

                                        {/* Contact Button */}
                                        <a
                                            href={`tel:${product.business?.phone}`}
                                            className="mt-4 w-full block text-center bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                        >
                                            Contact Seller
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
