import { useQuery } from "@tanstack/react-query";
import axiosInstance from "app/axiosInterceptor";
import useFeatureFlagStore from "Stores/FeatureFlagStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const featureFlagQueries = () => {
    const { setIsOtpActive,setIsRemoteSignatureActive } = useFeatureFlagStore();

    useQuery({
        queryKey: ["otpIsActive"],
        queryFn: async () => {
            const response = await axiosInstance.get(`${API_URL}/otp/is-active`);
            setIsOtpActive(response.data);
            return response.data;
        },
    });
    
    useQuery({
        queryKey: ["remoteSignActive"],
        queryFn: async () => {
            const response = await axiosInstance.get(`${API_URL}/signature/is-remote-signature-active`);
            setIsRemoteSignatureActive(response.data);
            return response.data;
        },
    });

    return {};
}