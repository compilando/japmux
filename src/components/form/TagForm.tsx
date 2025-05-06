import React, { useState, useEffect } from 'react';
import { Tag, TagCreatePayload, TagUpdatePayload } from '@/services/api'; // Make sure the path is correct

interface TagFormProps {
    initialData: Tag | null;
    onSave: (payload: TagCreatePayload | TagUpdatePayload) => void;
    onCancel: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');
    // TODO: Add states for other Tag fields

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            // TODO: Initialize other states with initialData
        } else {
            setName('');
            // TODO: Reset other states
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const payload: TagCreatePayload | TagUpdatePayload = {
            name,
            // TODO: Add other fields to the payload
        };
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            {/* TODO: Add form fields for other Tag attributes */}

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
                    {initialData ? 'Save Changes' : 'Create Tag'}
                </button>
            </div>
        </form>
    );
};

export default TagForm; 