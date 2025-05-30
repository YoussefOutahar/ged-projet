import { ReactNode } from "react";

import TagsList from "app/component/admin/view/referentiel-doc/tag/list/tag-list-admin.component";
import AuthGuard from "app/component/auth/auth-guard.component";
import Layout from "layout/layout";

const Tags = () => <TagsList />;

Tags.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default Tags;
