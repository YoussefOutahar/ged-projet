import React from 'react';
import { Message } from 'primereact/message';

interface QueryError {
    queryKey: string;
    error: Error;
}

interface ErrorToastProps {
    errors: QueryError[];
}

const ErrorToast: React.FC<ErrorToastProps> = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
        <div className="fixed bottom-0 right-0 p-4 z-5">
            {errors.map(({ queryKey, error }, index) => (
                <div key={index} className="mb-2">
                    <Message
                        severity="warn"
                        text={`Failed to load ${queryKey}`}
                        className="w-full"
                    />
                </div>
            ))}
        </div>
    );
};

export default ErrorToast;