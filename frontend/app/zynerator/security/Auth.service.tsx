import { AxiosResponse } from "axios";
import axios from 'app/axiosInterceptor';

import jwt from 'jsonwebtoken';
import { NextRouter, useRouter } from "next/router";
import Cookies from "js-cookie";
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL as string;
export class AuthService {

    signIn(username: string, password: string): Promise<AxiosResponse<any>> {
        return axios.post(AUTH_URL, { username, password });
    }

    signOut() {
        this.removeToken();
        sessionStorage.removeItem('isTasksAlertShown');

    }

    logout(){
        const username = this.getUserName();
        try {
            axios.put(`${process.env.NEXT_PUBLIC_CONNEXION_URL}update-status/${username}`);
            this.signOut();
        } catch (error) {
            console.error('Error updating connexion status:', error);
        }
    }

    getRoleConnectedUser(): string {
        const decodedJwt = this.decodeJWT();
        return decodedJwt ? decodedJwt['roles'][0] : [];
    }
    getUserName(): string | never[] | undefined {
        const decodedJwt = this.decodeJWT();
        return decodedJwt ? decodedJwt['sub'] : [];
    }
    isAdmin(): boolean {
        return (this.getRoleConnectedUser() === "ROLE_ADMIN_FUNC")
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
        Cookies.set('token', jwt);
        Cookies.set('roleConnectedUser', this.getRoleConnectedUser());
    }

    removeToken() {
        localStorage.removeItem('token');
        Cookies.remove('token');
        Cookies.remove('roleConnectedUser');
    }

    getToken() {
        return localStorage.getItem('token')
    }

    decodeJWT(): jwt.JwtPayload {
        const token = this.getToken();

        if (token) {
            try {
                const decodedToken = jwt.decode(token.replace('Bearer ', '')) as jwt.JwtPayload;
                return decodedToken;
            } catch (error) {
                console.error('Error decoding JWT:', error);

            }
        }
        return {} as jwt.JwtPayload;
    }

    getUsername(): any {
        const tokenDecoded = this.decodeJWT();
        return tokenDecoded?.sub;
    }

    getExpirationFromToken() {
        const tokenDecoded = this.decodeJWT();
        return tokenDecoded ? tokenDecoded.exp as number : 0;
    }

    isTokenValid(): boolean {
        const exp = this.getExpirationFromToken();
        const now = Date.now();
        return exp * 1000 > now;
    }

    refreshToken(username: string, password: string): Promise<AxiosResponse<any>> {
        return this.signIn(username, password);
    }

    isTokenAboutToExpire(): boolean {
        const exp = this.getExpirationFromToken();
        const now = Date.now();
        const expiresIn = exp * 1000 - now;
        return expiresIn < 60 * 1000;
    }
    private checkingToken = false;
    async checkTokenStatus(router: NextRouter): Promise<void> {
        const token = this.getToken();
        if (!token) {
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_CONNEXION_URL}check-token-status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                this.handleTokenInvalid(router);
            }
        } catch (error) {
            console.error('Error checking token status:', error);
            this.handleTokenInvalid(router);
        }
    }

    private handleTokenInvalid(router: NextRouter) {
        this.removeToken();
        router.push('/auth');
    }
};