import { useQuery } from "@tanstack/react-query";
import axiosInstance from "app/axiosInterceptor";
import useAuditWorkflowStore from "Stores/AuditWorkflowStore";

export const auditStoreQueries = () => {
    const { setAudits, setAuditStats } = useAuditWorkflowStore();

    useQuery({
        queryKey: ["Audits"],
        queryFn: async () => {
            const response = await axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_API_URL}/workflows/audit`);
            setAudits(response.data);
            return response;
        },
    });


    useQuery({
        queryKey: ["AuditStats"],
        queryFn: async () => {
            const response = await axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_API_URL}/workflows/audit/audit-stats`);
            setAuditStats(response.data);
            return response;
        },
    });

    return {};
};