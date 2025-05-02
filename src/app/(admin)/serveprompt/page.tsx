import React from 'react';
// La importación se ajustará después de crear ServePromptForm
import ServePromptForm from '@/components/form/ServePromptForm';

const ServePromptPage: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Serve Prompt</h1>
            {/* Renderizar el formulario aquí */}
            <ServePromptForm />
        </div>
    );
};

export default ServePromptPage; 