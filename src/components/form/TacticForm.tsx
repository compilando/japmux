import React, { useState, useEffect } from 'react';
import {
    Tactic,
    CreateTacticDto,
    UpdateTacticDto
} from '@/services/api';

interface TacticFormProps {
    initialData: Tactic | null;
    onSave: (payload: CreateTacticDto | UpdateTacticDto) => void;
    onCancel: () => void;
}

const TacticForm: React.FC<TacticFormProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
        } else {
            // Reset form for creation
            setName('');
            setDescription('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        let payload: CreateTacticDto | UpdateTacticDto;

        if (isEditing) {
            payload = {
                name: name || undefined, // Enviar undefined si está vacío para no actualizar?
                description: description || undefined,
            } as UpdateTacticDto;
        } else {
            if (!name) {
                alert("Tactic Name is required.");
                return;
            }
            payload = {
                name: name,
                description: description || undefined,
            } as CreateTacticDto;
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter tactic name"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter a brief description"
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Tactic'}</button>
            </div>
        </form>
    );
};

export default TacticForm; 