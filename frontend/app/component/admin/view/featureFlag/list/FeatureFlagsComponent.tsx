import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface FeatureFlag {
    name: string;
    value: boolean;
}

const fetchFeatureFlags = async () => {
    const { data } = await axios.get<FeatureFlag[]>(`${process.env.NEXT_PUBLIC_FEATURE_URL}`);
    return data;
}

const updateFeatureFlag = async (featureFlag: FeatureFlag) => {
    const { data } = await axios.put<boolean>(`${process.env.NEXT_PUBLIC_FEATURE_URL}/${featureFlag.name}`, { value: featureFlag.value});
    return data;
}
const useFeatureFlags = () => {
    const { data: featureFlags, isError, error } = useQuery(
        {
            queryKey: ['featureFlags'],
            queryFn: fetchFeatureFlags,
            refetchOnWindowFocus: false,
            
        }
    );
    const mutation = useMutation<boolean, Error, FeatureFlag>({
        mutationFn: (featureFlag: FeatureFlag) => updateFeatureFlag(featureFlag),
        onMutate: async ({ name, value }) => {
            const prevFlags = featureFlags;
            const newFlags = featureFlags?.map(flag => flag.name === name ? { ...flag, value } : flag);
            return { prevFlags, newFlags };
        },
        onError: (error, variables, context) => {
            console.error('Error updating feature flag:', error);
        },
    });

    const isActiveBack = async (name: string) => {
        const flags = await fetchFeatureFlags();
        return flags.find(flag => flag.name === name)?.value ?? false;
    }

    const isActiveFront = (name: string) => {
        return featureFlags?.find(flag => flag.name === name)?.value ?? false;
    }

    const updateValue = async (name: string, value: boolean) => {
        await mutation.mutateAsync({ name, value });
    }

    if (isError) {
        console.error('Error fetching feature flags:', error);
    }

    return { featureFlags, isActiveBack, updateValue, isActiveFront };
}

export default useFeatureFlags;