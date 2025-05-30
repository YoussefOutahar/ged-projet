import { ReactNode } from "react";

import DocumentStatesList from "app/component/admin/view/referentiel-doc/document-state/list/document-state-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const DocumentStates = () => <DocumentStatesList />;

DocumentStates.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default DocumentStates;
