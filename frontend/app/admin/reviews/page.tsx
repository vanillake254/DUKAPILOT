'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import { adminAPI } from '@/lib/api';

export default function ReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsed = user ? JSON.parse(user) : null;
        if (!parsed || parsed.role !== 'SUPER_ADMIN') {
            router.push('/auth/admin');
            return;
        }
        loadReviews();
    }, [router]);

    const loadReviews = async () => {
        try {
            const response = await adminAPI.getReviews();
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await adminAPI.updateReview(id, true);
            loadReviews();
        } catch (error) {
            console.error('Failed to approve review:', error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await adminAPI.updateReview(id, false);
            loadReviews();
        } catch (error) {
            console.error('Failed to reject review:', error);
        }
    };

    const filteredReviews = reviews.filter((review) => {
        if (filter === 'pending') return !review.isApproved && review.isApproved !== false;
        if (filter === 'approved') return review.isApproved === true;
        if (filter === 'rejected') return review.isApproved === false;
        return true;
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Reviews Moderation</h1>
                    <p className="text-muted-foreground mt-1">Approve or reject customer reviews</p>
                </div>

                {/* Filters */}
                <div className="bg-card p-4 rounded-lg border border-border mb-6">
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === f
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="bg-card p-6 rounded-lg border border-border">
                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= review.rating
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'text-muted-foreground'
                                            }`}
                                    />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                    {review.rating}/5
                                </span>
                            </div>

                            {/* Business */}
                            <p className="text-sm text-muted-foreground mb-2">
                                For: <span className="font-medium text-foreground">{review.business?.businessName}</span>
                            </p>

                            {/* Customer */}
                            <p className="text-sm font-medium mb-2">{review.customerName}</p>

                            {/* Comment */}
                            {review.comment && (
                                <p className="text-sm bg-muted p-3 rounded mb-4 line-clamp-3">
                                    {review.comment}
                                </p>
                            )}

                            {/* Date */}
                            <p className="text-xs text-muted-foreground mb-4">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </p>

                            {/* Status */}
                            <div className="mb-4">
                                {review.isApproved === true && (
                                    <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                                        Approved
                                    </span>
                                )}
                                {review.isApproved === false && (
                                    <span className="px-3 py-1 text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                                        Rejected
                                    </span>
                                )}
                                {review.isApproved !== true && review.isApproved !== false && (
                                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                                        Pending
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            {review.isApproved !== true && review.isApproved !== false && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(review.id)}
                                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(review.id)}
                                        className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No {filter !== 'all' ? filter : ''} reviews found
                    </div>
                )}
            </div>
        </div>
    );
}
