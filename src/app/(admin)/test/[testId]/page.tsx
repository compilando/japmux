"use client";
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';

function TestPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    return (
        <div>
            <h1>Test Page</h1>
            <p>Test ID: {params.testId as string}</p>
            {searchParams && <p>Search Params: {JSON.stringify(Object.fromEntries(searchParams.entries()))}</p>}
        </div>
    );
}

export default TestPage; 