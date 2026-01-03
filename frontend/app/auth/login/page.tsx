'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        businessName: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authAPI.login(formData);
            const { token, business } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(business));

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">BIASHARA 360</h1>
                    <p className="text-muted-foreground">Sign in to your business account</p>
                </div>

                {/* Login Card */}
                <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Business Name */}
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                                Business Name
                            </label>
                            <input
                                id="businessName"
                                type="text"
                                required
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Enter your business name"
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
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="text-primary hover:underline font-medium">
                                Register your business
                            </Link>
                        </p>
                    </div>

                    {/* Admin Link */}
                    <div className="mt-4 text-center">
                        <Link href="/auth/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            Admin Login
                        </Link>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 rounded-md bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground text-center">
                        <strong>Demo:</strong> DemoStore / demo123
                    </p>
                </div>
            </div>
        </div>
    );
}
