import { ReactNode } from "react";

import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";
import MesTaches from 'app/component/admin/view/workflow/MesTaches';




const mesTaches = () => (
    <div className="flex flex-row-container">
      <MesTaches/>
    </div>
  );

  mesTaches.getLayout = function getLayout(page: ReactNode) {
    return (
      <AuthGuard>
        <Layout>{page}</Layout>
      </AuthGuard>
    );
  };
  export default mesTaches