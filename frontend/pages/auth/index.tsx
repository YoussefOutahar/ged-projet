import { ReactNode } from "react";

import AuthContainer from "app/component/auth/Auth.container";
import AuthLayout from "layout/AuthLayout";
import { AuthService } from "app/zynerator/security/Auth.service";
import { useRouter } from "next/router";

const Auth = () => {
  const authService = new AuthService();
  const router = useRouter();

  if (authService.isTokenValid()) {
    router.push("/dashboard");
  } else {
    return <AuthContainer />;
  }

  return <></>;
};

Auth.getLayout = function getLayout(page: ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Auth;
