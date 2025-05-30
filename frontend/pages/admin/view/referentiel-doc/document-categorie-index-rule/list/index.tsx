import { ReactNode } from "react";

import DocumentCategorieIndexRulesList from "app/component/admin/view/referentiel-doc/document-categorie-index-rule/list/document-categorie-index-rule-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const DocumentCategorieIndexRules = () => <DocumentCategorieIndexRulesList />;

DocumentCategorieIndexRules.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default DocumentCategorieIndexRules;
