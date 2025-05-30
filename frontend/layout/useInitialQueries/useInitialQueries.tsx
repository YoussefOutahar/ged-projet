import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { auditQueries } from 'Queries/AuditQueries';
import { docQueries } from 'Queries/DocQueries';
import { entiteQueries } from 'Queries/EntiteQueries';
import { featureFlagQueries } from 'Queries/FeatureFlagQueries';
import { planClassementQueries } from 'Queries/PlanClassementQueries';
import { userQueries } from 'Queries/UserQueries';
import { useEffect, useState } from 'react';

interface QueryError {
    queryKey: string;
    error: Error;
}

export const INITIAL_LOAD_KEY = 'app_initial_load_complete';

export const useInitialQueries = () => {
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(INITIAL_LOAD_KEY) === 'true';
        }
        return false;
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['users'],
                queryFn: userQueries,
            },
        ],
    });

    const isAnyLoading = !hasInitiallyLoaded && results.some(result => result.isLoading);

    useEffect(() => {
        if (!isAnyLoading && !hasInitiallyLoaded) {
            localStorage.setItem(INITIAL_LOAD_KEY, 'true');
            setHasInitiallyLoaded(true);
        }
    }, [isAnyLoading, hasInitiallyLoaded]);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                localStorage.removeItem(INITIAL_LOAD_KEY);
                setHasInitiallyLoaded(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const failedQueries: QueryError[] = results
        .map((result, index) => {
            if (result.isError && result.error instanceof Error) {
                return {
                    queryKey: ['users', 'entites', 'planClassement', 'docs', 'audits', 'featureFlags'][index],
                    error: result.error
                };
            }
            return null;
        })
        .filter((error): error is QueryError => error !== null);

    const queryStates = results.reduce<Record<string, { isLoading: boolean; isError: boolean; error: Error | null }>>((acc, result, index) => {
        const queryKey = ['users', 'entites', 'planClassement', 'docs', 'audits', 'featureFlags'][index];
        acc[queryKey] = {
            isLoading: result.isLoading,
            isError: result.isError,
            error: result.isError && result.error instanceof Error ? result.error : null
        };
        return acc;
    }, {});

    return {
        isLoading: isAnyLoading,
        failedQueries,
        queryStates
    };
};