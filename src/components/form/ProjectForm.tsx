import React, { useState, useEffect } from 'react';
import { Project, ProjectCreatePayload, ProjectUpdatePayload } from '@/services/api';
// Potencialmente podríamos importar usuarios si hubiera un endpoint get('/users')
// import { User, getUsers } from '@/services/api';

interface ProjectFormProps {
    initialData: Project | null;
    onSave: (data: ProjectCreatePayload | ProjectUpdatePayload) => void;
    onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ownerUserId, setOwnerUserId] = useState('');
    // const [availableUsers, setAvailableUsers] = useState<User[]>([]); // Para desplegable

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name ?? '');
            setDescription(initialData.description ?? '');
            setOwnerUserId(initialData.ownerUserId ?? '');
        } else {
            setName('');
            setDescription('');
            setOwnerUserId('');
        }
        // Aquí podríamos cargar usuarios si fuera un desplegable
        // fetchUsers();
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trim()) {
            alert('Project Name is required.');
            return;
        }

        const payload: ProjectCreatePayload | ProjectUpdatePayload = {
            name: name.trim(),
            description: description.trim() || undefined,
            ownerUserId: ownerUserId.trim() || undefined,
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input
                    type="text"
                    id="projectName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            {/* Owner User ID (Texto por ahora) */}
            <div>
                <label htmlFor="ownerUserId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner User ID (Optional)</label>
                <input
                    type="text"
                    id="ownerUserId"
                    value={ownerUserId}
                    onChange={(e) => setOwnerUserId(e.target.value)}
                    placeholder="Enter User CUID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {/* Si tuviéramos getUsers, sería <select> */}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {isEditing ? 'Update Project' : 'Create Project'}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm; 