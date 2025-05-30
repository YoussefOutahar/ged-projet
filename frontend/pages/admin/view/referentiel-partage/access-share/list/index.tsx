import { ReactNode } from "react";

import AccessSharesList from "app/component/admin/view/referentiel-partage/access-share/list/access-share-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const AccessShares = () => <AccessSharesList />;

AccessShares.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default AccessShares;
