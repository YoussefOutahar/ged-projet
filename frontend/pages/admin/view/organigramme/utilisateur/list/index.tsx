import { ReactNode } from "react";

import UtilisateursList from "app/component/admin/view/organigramme/utilisateur/list/utilisateur-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const Utilisateurs = () => <UtilisateursList />;

Utilisateurs.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default Utilisateurs;
