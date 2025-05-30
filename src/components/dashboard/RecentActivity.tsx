import React from 'react';

export const RecentActivity = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Activity 1</p>
                    <p className="text-sm text-muted-foreground">Description of activity 1</p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Activity 2</p>
                    <p className="text-sm text-muted-foreground">Description of activity 2</p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Activity 3</p>
                    <p className="text-sm text-muted-foreground">Description of activity 3</p>
                </div>
            </div>
        </div>
    );
}; 