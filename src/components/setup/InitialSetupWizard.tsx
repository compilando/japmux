"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService, authService } from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useAuth } from '@/context/AuthContext';

interface CheckUserResponse {
    exists: boolean;
    userId: string;
}

const InitialSetupWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [showWizard, setShowWizard] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Solo verificar si hay un usuario autenticado y el token está presente
        if (user && isAuthenticated && authService.isAuthenticated()) {
            console.log('Checking initial user setup...');
            checkInitialUser();
        }
    }, [user, isAuthenticated]); // Se ejecutará cuando el usuario se autentique y el token esté disponible

    const checkInitialUser = async () => {
        try {
            console.log('Making API call to check initial user...');
            const response = await userService.checkInitialUser();
            console.log('Initial user check response:', response);
            if (response.exists) {
                setUserId(response.userId);
                setShowWizard(true);
            }
        } catch (error: any) {
            console.error('Error checking initial user:', error);
            // Si es un 403, significa que el usuario no es un usuario inicial
            // No mostramos el wizard y no mostramos error
            if (error.response?.status === 403) {
                console.log('User is not an initial user, continuing normally...');
                return;
            }
            // Para otros errores, mostramos el mensaje
            showErrorToast('Error checking initial user setup');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showErrorToast('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            showErrorToast('Password must be at least 8 characters long');
            return;
        }

        if (!userId) {
            showErrorToast('User ID not found');
            return;
        }

        setIsLoading(true);
        try {
            await userService.updateInitialUser(userId, {
                email,
                password
            });
            showSuccessToast('Initial setup completed successfully');
            // Ocultar el wizard y redirigir
            setShowWizard(false);
            router.push('/');
        } catch (error) {
            console.error('Error updating initial user:', error);
            showErrorToast('Error updating initial user');
        } finally {
            setIsLoading(false);
        }
    };

    if (!showWizard) {
        return null; // No mostrar nada si no hay usuario inicial o no está autenticado
    }

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to japm.app
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Let's set up your initial configuration
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Updating...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InitialSetupWizard; 