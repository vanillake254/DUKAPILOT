'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { adminAPI } from '@/lib/api';

export default function ComplaintsPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [resolution, setResolution] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsed = user ? JSON.parse(user) : null;
        if (!parsed || parsed.role !== 'SUPER_ADMIN') {
            router.push('/auth/admin');
            return;
        }
        loadComplaints();
    }, [router]);

    const loadComplaints = async () => {
        try {
            const response = await adminAPI.getComplaints();
            setComplaints(response.data);
        } catch (error) {
            console.error('Failed to load complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: string) => {
        if (!resolution.trim()) {
            alert('Please enter a resolution');
            return;
        }

        try {
            await adminAPI.updateComplaint(id, 'RESOLVED', resolution);
            setSelectedComplaint(null);
            setResolution('');
            loadComplaints();
        } catch (error) {
            console.error('Failed to resolve complaint:', error);
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
                    <h1 className="text-3xl font-bold">Complaints Management</h1>
                    <p className="text-muted-foreground mt-1">Review and resolve customer complaints</p>
                </div>

                {/* Complaints List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* List */}
                    <div className="space-y-4">
                        {complaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                onClick={() => setSelectedComplaint(complaint)}
                                className={`bg-card p-4 rounded-lg border cursor-pointer transition-all ${selectedComplaint?.id === complaint.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                                        <span className="font-medium">{complaint.customerName}</span>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${complaint.status === 'PENDING'
                                                ? 'bg-yellow-500/10 text-yellow-600'
                                                : 'bg-primary/10 text-primary'
                                            }`}
                                    >
                                        {complaint.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Against: <span className="font-medium">{complaint.business?.businessName}</span>
                                </p>
                                <p className="text-sm line-clamp-2">{complaint.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(complaint.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Detail Panel */}
                    <div className="sticky top-6">
                        {selectedComplaint ? (
                            <div className="bg-card p-6 rounded-lg border border-border">
                                <h3 className="text-lg font-semibold mb-4">Complaint Details</h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Customer</p>
                                        <p className="font-medium">{selectedComplaint.customerName}</p>
                                        {selectedComplaint.customerEmail && (
                                            <p className="text-sm text-muted-foreground">{selectedComplaint.customerEmail}</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Business</p>
                                        <p className="font-medium">{selectedComplaint.business?.businessName}</p>
                                        <p className="text-sm text-muted-foreground">{selectedComplaint.business?.businessEmail}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                                        <p className="text-sm bg-muted p-3 rounded">{selectedComplaint.description}</p>
                                    </div>

                                    {selectedComplaint.status === 'PENDING' && (
                                        <>
                                            <div>
                                                <label className="text-sm text-muted-foreground mb-2 block">Resolution</label>
                                                <textarea
                                                    value={resolution}
                                                    onChange={(e) => setResolution(e.target.value)}
                                                    rows={4}
                                                    className="w-full px-3 py-2 rounded border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                                                    placeholder="Enter resolution details..."
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleResolve(selectedComplaint.id)}
                                                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Mark as Resolved
                                            </button>
                                        </>
                                    )}

                                    {selectedComplaint.status === 'RESOLVED' && selectedComplaint.resolution && (
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Resolution</p>
                                            <p className="text-sm bg-primary/10 p-3 rounded border border-primary/20">
                                                {selectedComplaint.resolution}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card p-12 rounded-lg border border-border text-center text-muted-foreground">
                                Select a complaint to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
