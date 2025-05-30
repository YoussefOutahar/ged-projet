import { useQuery } from "@tanstack/react-query";
import useAuditStore from "Stores/AuditStore";
import axiosInstance from "app/axiosInterceptor";

export const auditQueries = () => {
    const { setAudits, setAlerts, setAuditStats } = useAuditStore();

    useQuery({
        queryKey: ["Audits"],
        queryFn: async () => {
            const response = await axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}audit`);
            setAudits(response.data);
            return response;
        },
    });

    useQuery({
        queryKey: ["Alerts"],
        queryFn: async () => {
            const response = await axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}audit/alert`);
            setAlerts(response.data);
            return response;
        },
    });

    useQuery({
        queryKey: ["AuditStats"],
        queryFn: async () => {
            const response = await axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}audit/audit-stats`);
            setAuditStats(response.data);
            return response;
        },
    });

    return {};
};