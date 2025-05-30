import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { AuthService } from "app/zynerator/security/Auth.service";

const AccessDenied = () => {
  const router = useRouter();
  const authService = new AuthService();

  const onClickLogin = () => {
    authService.logout();
    router.push('/auth');
  };

  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="p-1 rounded-full"
          style={{
            background: "linear-gradient(180deg, rgba(220, 38, 38, 0.4) 10%, rgba(220, 38, 38, 0) 30%)"
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center rounded-full"
          >
            <div className="flex flex-column align-items-center gap-4">
              <i className="pi pi-ban text-red-500 text-5xl" />
              <span className="text-red-500 font-bold text-3xl">403</span>
              <h1 className="text-900 font-bold text-4xl m-0">Access Denied</h1>
              <p className="text-600 text-center mb-0">
                You don't have permission to access this resource.<br />
                Please contact your system administrator.
              </p>
              <div className="flex gap-2">
                <Button 
                  label="Go to Login" 
                  icon="pi pi-sign-in" 
                  severity="danger" 
                  onClick={onClickLogin}
                />
                <Button
                  label="Go Back"
                  icon="pi pi-arrow-left"
                  severity="danger"
                  outlined
                  onClick={() => router.back()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Remove getLayout since we don't want any layout
AccessDenied.getLayout = (page: React.ReactNode) => page;

export default AccessDenied;