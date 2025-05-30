import React, { useEffect, useRef, useState } from "react";

import { LayoutProvider } from "layout/context/layoutcontext";
import Layout from "layout/layout";
import type { AppProps } from "next/app";
import type { Page } from "types/types";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "/styles/layout/layout.scss";
import "/styles/scanner/scanner.scss";
import "/styles/demo/Demos.scss";
import "../styles/ExpandableCard.scss";
import "../styles/ProfileCard.scss";
import "../styles/tree-container.scss";
import { Provider } from "react-redux";
import store from "app/reduxConfig/ConfigureStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthService } from "app/zynerator/security/Auth.service";
import { useRouter } from "next/router";
import axiosInstance from "app/axiosInterceptor";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import TasksAlert from "app/component/admin/view/alerts/TasksAlert";

export const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 3, // 3 hours
        retry: 2,
      },
    },
  }
);

type Props = AppProps & {
  Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userService = new AuthService();
  const router = useRouter();

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      userService.logout();
      router.push("/auth");
    }, 15 * 60 * 1000); // 15 minutes
  };
  useEffect(() => {
    setHydrated(true);

    resetInactivityTimeout();

    const events = ['click', 'mousemove', 'keydown', 'scroll'];
    events.forEach(event =>
      window.addEventListener(event, resetInactivityTimeout)
    );

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, resetInactivityTimeout)
      );
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
      intervalRef.current = setInterval(async () => {
          const token = userService.getToken();
          if (!token) {
              if (intervalRef.current) {
                  clearInterval(intervalRef.current);
              }
              return;
          }
           
          try {
              await userService.checkTokenStatus(router);
          } catch (error) {
              router.push('/auth');

              if (intervalRef.current) {
                  clearInterval(intervalRef.current);
              }
          }
      }, 60 * 1000); // 60 secondes

      return () => {
          if (intervalRef.current) {
              clearInterval(intervalRef.current);
          }
      };
  }, [router]);

  if (!hydrated) {
    return null;
  }

  if (Component.getLayout) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <LayoutProvider>
              {Component.getLayout(<Component {...pageProps} />)}
              <ReactQueryDevtools initialIsOpen={false} />
              <TasksAlert />
            </LayoutProvider>
        </QueryClientProvider>
      </Provider>
    );
  } else {
    return (
      <Provider store={store}>
          <LayoutProvider>
            <QueryClientProvider client={queryClient}>
              <Layout>
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} />
                <TasksAlert />
              </Layout>
            </QueryClientProvider>
          </LayoutProvider>
      </Provider>
    );
  }
}
