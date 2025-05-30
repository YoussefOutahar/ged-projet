/* eslint-disable @next/next/no-img-element */

import React, { ReactElement } from "react";

import AppConfig from "layout/AppConfig";
import Link from "next/link";
import { Page } from "types/types";
import { Button } from "primereact/button";
import { useRouter } from "next/router";

const NotFoundPage: Page = () => {
  const router = useRouter();

  const onClickLogin = () => {
    router.push('/auth');
  };
  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div className="flex flex-column align-items-center justify-content-center">

        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
            style={{ borderRadius: "53px" }}
          >
            <span className="text-blue-500 font-bold text-3xl">404</span>
            <h1 className="text-900 font-bold text-5xl mb-2">Not Found</h1>
            <div className="text-600 mb-5">
              Requested resource is not available
            </div>
            <Button raised icon='pi pi-replay' onClick={onClickLogin}/>
          </div>
        </div>
      </div>
    </div>
  );
};
NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <React.Fragment>
      {page}
      <AppConfig simple />
    </React.Fragment>
  );
};

export default NotFoundPage;
