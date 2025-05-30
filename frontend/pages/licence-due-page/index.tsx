import LicencePage from "app/component/licence/licence-page";
import Head from "next/head";
import { Toast } from "primereact/toast";
import React from "react";
import { ReactElement } from "react";

const LicenceDuePage = () => {

    const toast = React.useRef(null);

    return (
        <React.Fragment>
            <Head>
                <title>YanDoc - Documentaire</title>
                <meta charSet="UTF-8" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content="YanDoc - Documentaire"></meta>
                <meta property="og:ttl" content="604800"></meta>
                <link rel="icon" href={`/logo-yan.ico`} type="image/x-icon"></link>
            </Head>

            <LicencePage toast={toast} />
            <Toast ref={toast} />
        </React.Fragment>
    );
};

LicenceDuePage.getLayout = function getLayout(page: ReactElement) {
    return page;
};

export default LicenceDuePage;