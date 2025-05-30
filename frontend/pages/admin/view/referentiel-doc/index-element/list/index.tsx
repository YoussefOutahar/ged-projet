import { ReactNode } from "react";

import IndexElementsList from "app/component/admin/view/referentiel-doc/index-element/list/index-element-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const IndexElements = () => <IndexElementsList />;

IndexElements.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default IndexElements;
