import React, { useState, useEffect } from 'react';
import { Project, CreateProjectDto, UpdateProjectDto, User } from '@/services/api';
// Potentially we could import users if there was an endpoint get('/users')
// import { User, getUsers } from '@/services/api';

interface ProjectFormProps {
    initialData: Project | null;
    users: User[];
    onSave: (data: CreateProjectDto | UpdateProjectDto) => void;
    onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, users, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ownerUserId, setOwnerUserId] = useState<string>('');
    // const [availableUsers, setAvailableUsers] = useState<User[]>([]); // For dropdown

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
        // Here we could load users if it was a dropdown
        // fetchUsers();
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trim()) {
            alert('Project Name is required.');
            return;
        }

        const trimmedName = name.trim();
        const trimmedDescription = description.trim() ? description.trim() : undefined;

        if (isEditing && initialData) {
            // Update operation
            const updatePayload: UpdateProjectDto = {};

            if (trimmedName !== initialData.name) {
                updatePayload.name = trimmedName;
            }
            const initialDescription = initialData.description ?? undefined;
            if (trimmedDescription !== initialDescription) {
                updatePayload.description = trimmedDescription;
            }

            const initialOwnerId = initialData.ownerUserId ?? '';
            if (ownerUserId !== initialOwnerId) {
                // Si ownerUserId es "" (ninguno seleccionado), enviar null o undefined según prefiera la API.
                // Si la API puede manejar "" como "sin propietario", entonces ownerUserId directamente.
                // Asumiendo que undefined es preferible para "no cambio" o "quitar propietario" si era opcional.
                updatePayload.ownerUserId = ownerUserId === "" ? undefined : ownerUserId;
            }

            if (Object.keys(updatePayload).length > 0) {
                onSave(updatePayload);
            } else {
                console.log("No changes detected for update.");
                onCancel();
            }
        } else {
            // Create operation
            if (!name.trim()) {
                alert('Project Name is required.');
                return;
            }

            if (!ownerUserId) {
                alert('Please select an Owner for the project.');
                return;
            }

            const createPayload: CreateProjectDto = {
                name: trimmedName,
                description: trimmedDescription,
                ownerUserId: ownerUserId,
            };
            onSave(createPayload);
        }
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

            {/* Owner User ID - Changed to Select */}
            <div>
                <label htmlFor="ownerUserId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner (Optional)</label>
                <select
                    id="ownerUserId"
                    value={ownerUserId}
                    onChange={(e) => setOwnerUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">-- Select Owner --</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name ? `${user.name} (${user.email})` : user.email}
                        </option>
                    ))}
                </select>
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

            {/* Buttons */}
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