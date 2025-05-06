"use client";

import React from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
// Importar los componentes de perfil existentes
import UserInfoCard from '@/components/user-profile/UserInfoCard';
import UserMetaCard from '@/components/user-profile/UserMetaCard';
import UserAddressCard from '@/components/user-profile/UserAddressCard';

const UserProfilePage: React.FC = () => {

    // Define crumbs for this page
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "User Profile" } // Last element without href
    ];

    // Here you could add logic to get user data
    // const { user } = useAuth(); // Example if Auth context has the data

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            {/* Render profile components */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    {/* Data placeholder - Pass real data to components */}
                    <UserInfoCard userData={null} />
                    <UserMetaCard userData={null} />
                </div>
                <div className="md:col-span-2">
                    <UserAddressCard userData={null} />
                    {/* Other profile components or sections could go here */}
                </div>
            </div>
        </>
    );
};

export default UserProfilePage; 