import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import axiosInstance from "app/axiosInterceptor";
import { RootState } from "app/reduxConfig/ConfigureStore";
import { AuthService } from "app/zynerator/security/Auth.service";
import { useRouter } from "next/router";
import { queryClient } from "pages/_app";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const SessionGuard = ({ children }: { children: JSX.Element }): JSX.Element => {

    const authService = new AuthService();
    
    const {connectedUser, setConnectedUser} = useConnectedUserStore();

    const router = useRouter();

    const password = useSelector((state: RootState) => state.auth.password);
    const refreshIntervalValue = process.env.NEXT_PUBLIC_REFRESH_INTERVAL as string ? parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL as string, 10) : 5000;

    const refreshInterval = useRef<NodeJS.Timeout | undefined>();
    const [tokenExpiredWhileHidden, setTokenExpiredWhileHidden] = useState(false);

    useEffect(() => {
        startRefreshInterval();

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            clearInterval(refreshInterval.current);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };

    }, [authService, connectedUser, password]);

    const startRefreshInterval = () => {
        refreshInterval.current = setInterval(checkTokenAndRefresh, refreshIntervalValue);
    };
    const checkTokenAndRefresh = async () => {
        if (authService.isTokenAboutToExpire()) {
            try {
                await axiosInstance.put(`${process.env.NEXT_PUBLIC_CONNEXION_URL}update-status/${connectedUser?.username}`);
                const data = await authService.refreshToken(connectedUser!.username, password);
                const jwt = data.headers['authorization'];
                if (jwt) {
                    authService.saveToken(jwt);
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                setTokenExpiredWhileHidden(true);
            }
        }
    };

    const handleBeforeUnload = async () => {
        clearInterval(refreshInterval.current);
    };

    const handleVisibilityChange = () => {
        // Users exit the page
        if (document.visibilityState === 'hidden') {
            clearInterval(refreshInterval.current);
        }

        // Users come back to the page and is authenticated
        if (document.visibilityState === 'visible' && authService.isTokenValid()) {
            startRefreshInterval();
        }


        // Users come back to the page and is not authenticated
        if (document.visibilityState === 'visible' && !authService.isTokenValid()) {
            authService.removeToken();
            setConnectedUser(null);
            queryClient.invalidateQueries()
            router.push('/');
        }
    };

    return children;
};

export default SessionGuard;