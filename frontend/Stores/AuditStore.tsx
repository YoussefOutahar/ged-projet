import { create } from 'zustand';

type State = {
    audits: any[];
    alerts: any[];
    auditStats: any[];
    setAudits: (audit: any[]) => void;
    setAlerts: (alert: any[]) => void;
    setAuditStats: (auditStats: any) => void;
    createAudit: (audit: any) => void;
    updateAudit: (audit: any) => void;
    deleteAudit: (id: number) => void;
};

const useAuditStore = create<State>((set) => ({
    audits: [],
    alerts: [],
    auditStats: [],
    setAudits: (audits: any[]) => set({ audits }),
    setAlerts: (alerts: any[]) => set({ alerts }),
    setAuditStats: (auditStats: any) => set({ auditStats }),
    createAudit: async (audit: any) => {
        set(state => ({ audits: [...state.audits, audit] }));
    },
    updateAudit: async (audit: any) => {
        set(state => ({ audits: state.audits.map(audit => audit.id === audit.id ? audit : audit) }));
    },
    deleteAudit: async (id: number) => {
        set(state => ({ audits: state.audits.filter(audit => audit.id !== id) }));
    },
}));

export default useAuditStore;