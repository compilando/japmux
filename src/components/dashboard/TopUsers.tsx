import React from 'react';

export const TopUsers = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">User 1</p>
                    <p className="text-sm text-muted-foreground">Activity: 100</p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">User 2</p>
                    <p className="text-sm text-muted-foreground">Activity: 80</p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">User 3</p>
                    <p className="text-sm text-muted-foreground">Activity: 60</p>
                </div>
            </div>
        </div>
    );
}; 