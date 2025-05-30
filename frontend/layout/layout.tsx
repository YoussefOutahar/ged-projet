/* eslint-disable react-hooks/exhaustive-deps */

import AppConfig from 'layout/AppConfig';
import AppFooter from 'layout/AppFooter';
import AppSidebar from 'layout/AppSidebar';
import AppTopbar from 'layout/AppTopbar';
import { LayoutContext } from 'layout/context/layoutcontext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PrimeReact from 'primereact/api';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppTopbarRef, ChildContainerProps, LayoutState } from 'types/types';
import "./i18n.js";
import { SocketProvider } from './context/SocketProvider';
import AuthGuard from 'app/component/auth/auth-guard.component';
import SessionGuard from 'app/component/auth/session-guard';
import NextTopLoader from 'nextjs-toploader';
import { userQueries } from 'Queries/UserQueries';
import { auditQueries } from 'Queries/AuditQueries';
import { docQueries } from 'Queries/DocQueries';
import { entiteQueries } from 'Queries/EntiteQueries';
import { planClassementQueries } from 'Queries/PlanClassementQueries';
import { featureFlagQueries } from 'Queries/FeatureFlagQueries';
import RandomLoader from './RandomLoader/RandomLoader';
import { useInitialQueries } from './useInitialQueries/useInitialQueries';
import ErrorToast from './useInitialQueries/ErrorToast';

const Layout = ({ children }: ChildContainerProps) => {
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const topbarRef = useRef<AppTopbarRef>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                sidebarRef.current?.isSameNode(event.target as Node) ||
                sidebarRef.current?.contains(event.target as Node) ||
                topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.menubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current?.topbarmenu?.isSameNode(event.target as Node) ||
                topbarRef.current?.topbarmenu?.contains(event.target as Node) ||
                topbarRef.current?.topbarmenubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.topbarmenubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({ ...prevLayoutState, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({ ...prevLayoutState, profileSidebarVisible: false }));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    const unblockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });
    }, []);

    PrimeReact.ripple = true;

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    userQueries();
    entiteQueries();
    planClassementQueries();
    docQueries();
    auditQueries();
    featureFlagQueries();

    const { isLoading, failedQueries, queryStates } = useInitialQueries();
    const [loadingKey, setLoadingKey] = useState(0);
    useEffect(() => {
        if (isLoading) {
            setLoadingKey(prev => prev + 1);
        }
    }, [isLoading]);

    return (
        <React.Fragment>
            <Head>
                <title>
                    YanDoc - Documentaire</title>
                <meta charSet="UTF-8" />
                <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content="YanDoc - Documentaire"></meta>
                <meta property="og:ttl" content="604800"></meta>
                <link rel="icon" href={`/logo-yan.ico`} type="image/x-icon"></link>
            </Head>

            <AuthGuard>
                <SessionGuard>
                    <SocketProvider>
                        <NextTopLoader
                            color="#123c69"
                            initialPosition={0.08}
                            crawlSpeed={200}
                            height={5}
                            crawl={false}
                            showSpinner={false}
                            easing="ease"
                            speed={200}
                        // shadow="0 0 10px #123c69,0 0 5px #123c69"
                        />

                        <>
                            <div className={containerClass}>
                                <AppTopbar ref={topbarRef} />
                                <div ref={sidebarRef} className="layout-sidebar">
                                    <AppSidebar />
                                </div>
                                <div className="layout-main-container">
                                    <div className="layout-main">{children}</div>
                                    <AppFooter />
                                </div>
                                <AppConfig />
                                <div className="layout-mask"></div>
                            </div>
                            {/* <ErrorToast errors={failedQueries} /> */}
                        </>

                        {!isLoading ? (<>
                                {/* <div className={containerClass}>
                                    <AppTopbar ref={topbarRef} />
                                    <div ref={sidebarRef} className="layout-sidebar">
                                        <AppSidebar />
                                    </div>
                                    <div className="layout-main-container">
                                        <div className="layout-main">{children}</div>
                                        <AppFooter />
                                    </div>
                                    <AppConfig />
                                    <div className="layout-mask"></div>
                                </div> */}
                                {/* <ErrorToast errors={failedQueries} /> */}
                            </>) : (
                                <></>
                            //     <div className="layout-wrapper flex align-items-center justify-content-center min-h-screen">
                            //     <RandomLoader loadingKey={loadingKey} />
                            // </div>
                        )}              

                    </SocketProvider>
                </SessionGuard>
            </AuthGuard>

        </React.Fragment>
    );
};

export default Layout;
