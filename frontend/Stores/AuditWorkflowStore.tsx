import { create } from 'zustand';

type State = {
    audits: any[];
    auditStats: any[];
    setAudits: (audit: any[]) => void;
    setAuditStats: (auditStats: any) => void;
    createAudit: (audit: any) => void;
    updateAudit: (audit: any) => void;
    deleteAudit: (id: number) => void;
};

const useAuditWorkflowStore = create<State>((set) => ({
    audits: [],
    auditStats: [],
    setAudits: (audits: any[]) => set({ audits }),
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

export default useAuditWorkflowStore;