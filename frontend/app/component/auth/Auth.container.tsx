import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { MessageService } from 'app/zynerator/service/MessageService';
import { useDispatch } from 'react-redux';
import { loginSuccess } from 'app/reduxConfig/auth/reducer/authReducer';
import axiosInstance from 'app/axiosInterceptor';
import AuthGuard from './auth-guard.component';
import FaceAuth from './Face-Auth';
import { queryClient } from 'pages/_app';


const AuthContainer: React.FC = ({ }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const router = useRouter();
    const [userService, setUserService] = useState(new AuthService());
    const toast = useRef<Toast>(null);
    const dispatch = useDispatch();

    const handleAuthFormClick = async (event: any) => {
        event.preventDefault();

        userService.signIn(username, password).then(data => {
            const jwt = data.headers['authorization'];
            if (jwt) {
                userService.saveToken(jwt)
                dispatch(loginSuccess({ password: password }));
                axiosInstance.get<number>(`${process.env.NEXT_PUBLIC_CONNEXION_URL}count/${username}`)
                    .then(response => {

                        if (response.data == 1) {
                            router.push('/profile');
                        }
                        else {
                            router.push("/dashboard");
                        }
                    })
                    .catch(error => console.error('Erreur lors du chargement des connexions', error));

                    queryClient.invalidateQueries({
                        queryKey: ['ConnectedUser']
                    });

            } else {
                MessageService.showError(toast, 'Error !', 'Probléme de connexion');
            }
        }).catch((Error) => {

            if (Error.response && Error.response.status == 418) {
                MessageService.showError(toast, 'Error !', 'Votre licence a expiré');
                setTimeout(() => {
                    router.push('/licence-due-page');
                }, 2000);
                return;
            }
            if (Error.response && Error.response.data.message == "Votre compte est désactivé") {
                MessageService.showError(toast, 'Error !', Error.response.data.message);
            }
            if (Error.response && Error.response.status === 409) {
                // 409 Conflict: User already connected
                MessageService.showError(toast, 'Error !', 'Utilisateur déjà connecté');
            } else {
                MessageService.showError(toast, 'Error !', 'Vos identifiants sont incorrects');
            }
        })
    }

    return (
        <div className={styles.authForm} style={{marginTop:"3rem"}}>
            <img src='/Images/logo-yandoc.png' alt='logo' style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            <h2 className="mb-4 text-xl mt-6" style={{ color: '#003468', textAlign: 'center' }}>Saisissez vos identifiants</h2>
            <span className="mb-4 text-sm">Votre mail et mot de passe seront utilisés pour vous connecter ou alors pour vous inviter à créer un compte si vous n'en avez pas encore.</span>
            <form onSubmit={handleAuthFormClick} className=''>
                <label htmlFor="email" className="block text-900 text-sm font-medium mb-2">
                    Username
                </label>
                <InputText id="email" type="text" placeholder="Saisissez votre email"
                    onChange={(e) => setUsername(e.target.value)} className="w-full mb-3"
                    style={{ padding: '1rem', height: '40px' }} />

                <label htmlFor="password" className="block text-900 font-medium text-sm mb-2">
                    Mot de passe
                </label>
                <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    feedback={false} placeholder="Saisissez votre mot de passe" toggleMask className="w-full mb-3"
                    inputClassName="w-full p-3 md:w-30rem" style={{ height: '40px' }}></Password>

                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                    <div className="flex align-items-center">
                        <Checkbox inputId="rememberMe" checked={checked}
                            onChange={(e) => setChecked(e.checked ?? false)} className="mr-2 w-2 h-2"></Checkbox>
                        <label htmlFor="rememberMe" className='text-sm'>Remember me</label>
                    </div>
                </div>
                <Button type='submit' raised label="Se connecter" className="w-full p-3 text-large hover:bg-green-600" style={{ backgroundColor: '#4a5196', border: 'none' }}></Button>
            </form>
            <Toast ref={toast} />
        </div>
    );
};

export default AuthContainer;
