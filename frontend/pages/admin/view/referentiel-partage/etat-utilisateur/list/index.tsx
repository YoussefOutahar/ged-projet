import { ReactNode } from "react";

import EtatUtilisateursList from "app/component/admin/view/referentiel-partage/etat-utilisateur/list/etat-utilisateur-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const EtatUtilisateurs = () => <EtatUtilisateursList />;

EtatUtilisateurs.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default EtatUtilisateurs;
