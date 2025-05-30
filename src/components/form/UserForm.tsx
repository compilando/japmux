import React, { useState, useEffect } from 'react';
import {
    UserProfileResponse as User,
    CreateUserDto,
    ExtendedUserProfileResponse
} from '@/services/api';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/context/AuthContext';

interface UserFormProps {
    initialData: User | null;
    onSave: (payload: CreateUserDto | object) => void;
    onCancel: () => void;
}

type UserRole = 'user' | 'admin' | 'tenant_admin' | 'prompt_consumer';

const UserForm: React.FC<UserFormProps> = ({ initialData, onSave, onCancel }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [role, setRole] = useState<UserRole>('user');
    const isEditing = !!initialData;
    const { selectedTenantId } = useTenant();
    const { user } = useAuth() as { user: ExtendedUserProfileResponse | null };

    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email || '');
            setName(initialData.name || '');
            setRole((initialData as ExtendedUserProfileResponse).role as UserRole || 'user');
            // We don't initialize the password in edit mode for security/UX
            setPassword('');
            setConfirmPassword('');
        } else {
            // Reset for creation mode
            setEmail('');
            setName('');
            setPassword('');
            setConfirmPassword('');
            setRole('user');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Validate passwords match
        if (!isEditing && password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setPasswordError('');
        const payload: CreateUserDto | object = {
            email,
            name: name || undefined,
            role,
            ...(password && { password }),
            // Add tenantId if user is tenant_admin
            ...(user?.role === 'tenant_admin' && selectedTenantId && { tenantId: selectedTenantId }),
        };

        if (isEditing && !password) {
            const updatePayload = { ...payload };
            delete (updatePayload as { password?: string }).password;
            onSave(updatePayload);
            return;
        }

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                </label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="tenant_admin">Tenant Admin</option>
                    <option value="prompt_consumer">Prompt Consumer</option>
                </select>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password {isEditing ? "(Leave blank to keep current)" : ""}
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value !== confirmPassword) {
                            setPasswordError('Passwords do not match');
                        } else {
                            setPasswordError('');
                        }
                    }}
                    required={!isEditing} // Required only when creating
                    autoComplete="new-password" // Helps prevent unwanted autocompletion
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            {!isEditing && (
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (e.target.value !== password) {
                                setPasswordError('Passwords do not match');
                            } else {
                                setPasswordError('');
                            }
                        }}
                        required={!isEditing}
                        autoComplete="new-password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                    {passwordError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                    )}
                </div>
            )}

            {/* TODO: Add form fields for other User attributes (roles, etc.) */}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {initialData ? 'Save Changes' : 'Create User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm; 