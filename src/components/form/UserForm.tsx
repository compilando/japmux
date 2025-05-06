import React, { useState, useEffect } from 'react';
import { User, UserCreatePayload, UserUpdatePayload } from '@/services/api'; // Make sure the path is correct

interface UserFormProps {
    initialData: User | null;
    onSave: (payload: UserCreatePayload | UserUpdatePayload) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSave, onCancel }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email || '');
            setName(initialData.name || '');
            // We don't initialize the password in edit mode for security/UX
            setPassword('');
        } else {
            // Reset for creation mode
            setEmail('');
            setName('');
            setPassword('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const payload: UserCreatePayload | UserUpdatePayload = {
            email,
            name: name || undefined, // Send undefined if empty
            // Include password only if entered (and perhaps only when creating)
            ...(password && { password }),
            // TODO: Add other fields to the payload
        };

        // You might want to remove the password from the payload if editing and it wasn't changed
        if (isEditing && !password) {
            delete (payload as UserUpdatePayload).password;
        }

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password {isEditing ? "(Leave blank to keep current)" : ""}
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isEditing} // Required only when creating
                    autoComplete="new-password" // Helps prevent unwanted autocompletion
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            {/* TODO: Add form fields for other User attributes (roles, etc.) */}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {initialData ? 'Save Changes' : 'Create User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm; 