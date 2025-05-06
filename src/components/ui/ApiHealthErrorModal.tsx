import React from 'react';
import Button from './button/Button'; // Adjust path if necessary

interface ApiHealthErrorModalProps {
    isOpen: boolean;
    onRetry: () => void;
    isLoading: boolean;
}

const ApiHealthErrorModal: React.FC<ApiHealthErrorModalProps> = ({ isOpen, onRetry, isLoading }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">API Connection Error</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    There was a problem connecting to the backend API. The application cannot function correctly until the connection is restored.
                </p>
                <Button
                    onClick={onRetry}
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Retrying...' : 'Retry Connection'}
                </Button>
            </div>
        </div>
    );
};

export default ApiHealthErrorModal; 