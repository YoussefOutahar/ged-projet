import { AuthService } from 'app/zynerator/security/Auth.service';
import { useRouter } from 'next/router';
import React from 'react';

const AuthGuard = ({ children }: { children: JSX.Element }): JSX.Element => {
    const authService = new AuthService();
    const router = useRouter();

    if (authService.isTokenValid() == true && router.pathname !== '/auth') {
        return children;
    } else {
        router.push('/auth');
    }

    return <></>
};
export default AuthGuard
