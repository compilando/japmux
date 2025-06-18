'use client';

import React, { useState } from 'react';
import { CreateApiKeyDto } from '@/services/api';

interface ApiKeyFormProps {
    onSubmit: (data: CreateApiKeyDto) => void;
    onCancel: () => void;
}

const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10);
};

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState(() => {
        const randomPart = generateRandomId();
        return `dev-key-${randomPart}`;
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="e.g., My Awesome App Key"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !name.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Create Key'}
                </button>
            </div>
        </form>
    );
};

export default ApiKeyForm; 