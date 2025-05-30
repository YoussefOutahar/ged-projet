import { ReactNode } from "react";

import RoleUtilisateursList from "app/component/admin/view/referentiel-partage/role-utilisateur/list/role-utilisateur-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const RoleUtilisateurs = () => <RoleUtilisateursList />;

RoleUtilisateurs.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default RoleUtilisateurs;
