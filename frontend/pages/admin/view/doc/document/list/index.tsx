import { ReactNode } from "react";

import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";
import TreeListOrganigramme from "app/component/admin/view/doc/document/tree/treeList";

const Documents = () => (
  <div className="flex flex-row-container">
    <TreeListOrganigramme />
  </div>
);
Documents.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default Documents;
