import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { AuthService } from 'app/zynerator/security/Auth.service';
import InsightsComponent from './Components/InsightsComponent';
import UrgentNormalePolarArea from './Components/UrgentNormalPolarArea';
import WorkflowsByDepartmentPolarArea from './Components/WorkflowsByDepartementPolarArea';
import WorkflowByInitiator from './Components/WorkflowByInitiator';
import CertificationsPerWorkflow from './Components/CertificationsPerWorkflow';
import WorkflowDuration from './Components/WorkflowDuration';
import TopSlowSteps from './Components/TopSlowSteps';
import WorkflowInstanceKpis from 'app/component/admin/view/workflow/Dashboard/Components/WorkflowInstanceKpis';

const WorkflowDashboard: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const authService = new AuthService();

    useEffect(() => {
        const isAdminFlag = authService.isAdmin();
        setIsAdmin(isAdminFlag);
    }, []);

    return (
        <div>
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12">
                    <InsightsComponent isAdmin={isAdmin} />
                </div>
                <div className="col-12 xl:col-4">
                    <UrgentNormalePolarArea isAdmin={isAdmin} />
                </div>
                <div className="col-12 xl:col-8">
                    <CertificationsPerWorkflow />
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card h-full">
                        <h5>Durée des Worflows</h5>
                        <WorkflowDuration />
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card h-full">
                        <TopSlowSteps />
                    </div>
                </div>
                <div className='col-12 '>
                    <WorkflowInstanceKpis />
                </div>
                <div className="col-12">
                    <div className="card">
                        <h5>Workflow par initaiteur</h5>
                        <WorkflowByInitiator isAdmin={isAdmin} toast={toast} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowDashboard;