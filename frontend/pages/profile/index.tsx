import { ReactNode } from "react";

import AuthGuard from "app/component/auth/auth-guard.component";
import ProfileContainer from "app/component/profile/profile.component";
import Layout from "layout/layout";

const Profile = () => <ProfileContainer />;

Profile.getLayout = function getLayout(page: ReactNode) {
  return (
    <AuthGuard>
      <Layout>{page}</Layout>
    </AuthGuard>
  );
};

export default Profile;
