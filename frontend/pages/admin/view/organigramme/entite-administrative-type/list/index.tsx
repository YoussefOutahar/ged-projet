import { ReactNode } from "react";

import EntiteAdministrativeTypesList from "app/component/admin/view/organigramme/entite-administrative-type/list/entite-administrative-type-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const EntiteAdministrativeTypes = () => <EntiteAdministrativeTypesList />;

EntiteAdministrativeTypes.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default EntiteAdministrativeTypes;
