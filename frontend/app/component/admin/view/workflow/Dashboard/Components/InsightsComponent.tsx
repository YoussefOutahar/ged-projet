import React, { useEffect, useState } from 'react';
import { WorkflowKPIService } from 'app/controller/service/workflow/workflowKPIService';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';

interface InsightsProps {
    isAdmin: boolean;
    userId?: number;
}

const InsightsComponent: React.FC<InsightsProps> = ({ isAdmin, userId }) => {
    const [workflowCount, setWorkflowCount] = useState<number>(0);
    const [waitingWorkflowCount, setWaitingWorkflowCount] = useState<number>(0);
    const [closedWorkflowCount, setClosedWorkflowCount] = useState<number>(0);
    const [rejectedWorkflowCount, setRejectedWorkflowCount] = useState<number>(0);
    const [cancelledWorkflowCount, setCancelledWorkflowCount] = useState<number>(0);

    const workflowKPIService = new WorkflowKPIService();

    const fetchInsights = async () => {
        try {
            if (userId) {
                const [total, open, closed, rejected, cancelled] = await Promise.all([
                    workflowKPIService.countWorkflowsByUser(userId),
                    workflowKPIService.countWorkflowsByStatusByInitiateurId(WorkflowDTO.StatusEnum.OPEN, userId),
                    workflowKPIService.countWorkflowsByStatusByInitiateurId(WorkflowDTO.StatusEnum.CLOSED, userId),
                    workflowKPIService.countWorkflowsByStatusByInitiateurId(WorkflowDTO.StatusEnum.REJECTED, userId),
                    workflowKPIService.countWorkflowsByStatusByInitiateurId(WorkflowDTO.StatusEnum.Annulled, userId)
                ]);

                setWorkflowCount(total.data);
                setWaitingWorkflowCount(open.data);
                setClosedWorkflowCount(closed.data);
                setRejectedWorkflowCount(rejected.data);
                setCancelledWorkflowCount(cancelled.data);
            } else {
                const [total, open, closed, rejected, cancelled] = await Promise.all([
                    workflowKPIService.countWorkflows(),
                    workflowKPIService.countWorkflowsByStatus(WorkflowDTO.StatusEnum.OPEN),
                    workflowKPIService.countWorkflowsByStatus(WorkflowDTO.StatusEnum.CLOSED),
                    workflowKPIService.countWorkflowsByStatus(WorkflowDTO.StatusEnum.REJECTED),
                    workflowKPIService.countWorkflowsByStatus(WorkflowDTO.StatusEnum.Annulled)
                ]);

                setWorkflowCount(total.data);
                setWaitingWorkflowCount(open.data);
                setClosedWorkflowCount(closed.data);
                setRejectedWorkflowCount(rejected.data);
                setCancelledWorkflowCount(cancelled.data);
            }
        } catch (error) {
            console.error('Error fetching insights:', error);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchInsights();
        }
    }, [isAdmin, userId]);

    const insightItem = (title: string, value: number, icon: string, bgColor: string, iconColor: string) => (
        <div className="col flex-grow-1">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">{value}</div>
                    </div>
                    <div className={`flex align-items-center justify-content-center ${bgColor} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={`pi ${icon} ${iconColor}`}></i>
                    </div>
                </div>
            </div>
        </div>
    );

    const insights = () => {
        return (
            <div className="grid">
                {insightItem("workflow", workflowCount, "pi-sitemap", "bg-blue-100", "text-blue-500")}
                {insightItem("En Cours", waitingWorkflowCount, "pi-play", "bg-blue-500", "text-white")}
                {insightItem("Cloture", closedWorkflowCount, "pi-check-circle", "bg-green-100", "text-green-500")}
                {insightItem("Rejete", rejectedWorkflowCount, "pi-ban", "bg-red-100", "text-red-500")}
                {insightItem("Annulé", cancelledWorkflowCount, "pi-times-circle", "bg-orange-100", "text-orange-500")}
            </div>
        );
    };

    return (
        <div className="col-12">
            {isAdmin && insights()}
        </div>
    );
};

export default InsightsComponent;