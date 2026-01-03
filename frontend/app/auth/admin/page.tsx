'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authAPI.loginAdmin(formData);
            const { token, admin } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ ...admin, role: 'SUPER_ADMIN' }));

            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-primary/5 px-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary mb-2">Admin Portal</h1>
                    <p className="text-muted-foreground">BIASHARA 360 Platform Management</p>
                </div>

                {/* Login Card */}
                <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Admin Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="admin@biashara360.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                        </button>
                    </form>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
                        <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            ← Back to Business Login
                        </Link>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 rounded-md bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground text-center">
                        <strong>Demo Admin:</strong> admin@biashara360.com / admin123
                    </p>
                </div>
            </div>
        </div>
    );
}
