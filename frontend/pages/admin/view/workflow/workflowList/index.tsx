import { ReactNode } from "react";

import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

import WorkflowList from 'app/component/admin/view/workflow/WorkflowList';



const workflowList = () => (
    <div className="flex flex-row-container">
      <WorkflowList />
    </div>
  );

  workflowList.getLayout = function getLayout(page: ReactNode) {
    return (
      <AuthGuard>
        <Layout>{page}</Layout>
      </AuthGuard>
    );
  };
  export default WorkflowList