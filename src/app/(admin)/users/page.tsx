"use client";

import React, { useState, useEffect } from 'react';
import {
    User,
    userService,
    CreateUserDto,
    UpdateUserDto
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import UsersTable from '@/components/tables/UsersTable';
import UserForm from '@/components/form/UserForm';
import axios from 'axios';

const UsersPage: React.FC = () => {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.findAll();
            if (Array.isArray(data)) {
                setUsersList(data);
            } else {
                console.error("API response for /users is not an array:", data);
                setError('Received invalid data format for users.');
                setUsersList([]);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch users.');
            setUsersList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.remove(id);
                fetchData();
            } catch (err) {
                setError('Failed to delete user');
                console.error(err);
                if (axios.isAxiosError(err)) {
                    alert(`Error deleting: ${err.response?.data?.message || err.message}`);
                } else if (err instanceof Error) {
                    alert(`Error deleting: ${err.message}`);
                }
            }
        }
    };

    const handleSave = async (payload: CreateUserDto | UpdateUserDto) => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, payload as UpdateUserDto);
            } else {
                await userService.create(payload as CreateUserDto);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError('Failed to save user');
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    return (
        <>
            <Breadcrumb pageTitle="Users" />
            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Add User
                </button>
            </div>
            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <UsersTable
                        users={usersList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h3>
                        <UserForm
                            initialData={editingUser}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default UsersPage; 