'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, Settings } from 'lucide-react';
import { businessAPI } from '@/lib/api';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        phone: '',
        description: '',
        locationAddress: '',
        locationLat: '',
        locationLng: '',
        mpesaNumber: '',
        tillNumber: '',
        paybillNumber: '',
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await businessAPI.getMe();
                const b = res.data;
                setFormData({
                    phone: b?.phone || '',
                    description: b?.description || '',
                    locationAddress: b?.locationAddress || '',
                    locationLat: b?.locationLat !== null && b?.locationLat !== undefined ? String(b.locationLat) : '',
                    locationLng: b?.locationLng !== null && b?.locationLng !== undefined ? String(b.locationLng) : '',
                    mpesaNumber: b?.mpesaNumber || '',
                    tillNumber: b?.tillNumber || '',
                    paybillNumber: b?.paybillNumber || '',
                });
            } catch (e: any) {
                setError(e?.response?.data?.message || 'Failed to load business settings');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await businessAPI.updateMe({
                phone: formData.phone || undefined,
                description: formData.description || undefined,
                locationAddress: formData.locationAddress || undefined,
                locationLat: formData.locationLat ? parseFloat(formData.locationLat) : undefined,
                locationLng: formData.locationLng ? parseFloat(formData.locationLng) : undefined,
                mpesaNumber: formData.mpesaNumber || undefined,
                tillNumber: formData.tillNumber || undefined,
                paybillNumber: formData.paybillNumber || undefined,
            });
            setSuccess('Settings saved successfully');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
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
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground mt-1">Update your business profile & payment details</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">Business Profile</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g. 0712345678"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Tell customers about your business"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Location Address</label>
                        <input
                            value={formData.locationAddress}
                            onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Nairobi CBD"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Latitude</label>
                            <input
                                value={formData.locationLat}
                                onChange={(e) => setFormData({ ...formData, locationLat: e.target.value })}
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="-1.286389"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Longitude</label>
                            <input
                                value={formData.locationLng}
                                onChange={(e) => setFormData({ ...formData, locationLng: e.target.value })}
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="36.817223"
                            />
                        </div>
                    </div>

                    <div className="border-t border-border pt-6">
                        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">M-Pesa Number</label>
                                <input
                                    value={formData.mpesaNumber}
                                    onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="07XXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Till Number</label>
                                <input
                                    value={formData.tillNumber}
                                    onChange={(e) => setFormData({ ...formData, tillNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="123456"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Paybill Number</label>
                                <input
                                    value={formData.paybillNumber}
                                    onChange={(e) => setFormData({ ...formData, paybillNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="123456"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </div>
    );
}
