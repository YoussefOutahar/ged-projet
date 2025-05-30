import { ReactNode } from "react";

import DocumentCategorieIndexsList from "app/component/admin/view/referentiel-doc/document-categorie-index/list/document-categorie-index-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const DocumentCategorieIndexs = () => <DocumentCategorieIndexsList />;

DocumentCategorieIndexs.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default DocumentCategorieIndexs;
