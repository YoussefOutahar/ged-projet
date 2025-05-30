/* eslint-disable @next/next/no-img-element */

import axiosInstance from 'app/axiosInterceptor';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { LayoutContext } from 'layout/context/layoutcontext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Chip } from 'primereact/chip';
import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppTopbarRef } from 'types/types';
import Cookies from 'js-cookie';
import AppActivité from './AppActivité';
import NotificationIndicator from './NotificationIndicator';
import { Badge } from 'primereact/badge';
import AppMenuICon from './AppAppMenuICon';
import { TieredMenu } from 'primereact/tieredmenu';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useSocket } from './context/SocketProvider';
import { NotificationDTO } from './NotificatioDto';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';
import useAuditStore from 'Stores/AuditStore';
import { queryClient } from 'pages/_app';
import { INITIAL_LOAD_KEY } from './useInitialQueries/useInitialQueries';

const USER_URL = process.env.NEXT_PUBLIC_USER_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [activiteVisible, setActiviteVisible] = useState(false);

    const router = useRouter();
    const menu = useRef<TieredMenu>(null);

    const [selectedNotification, setSelectedNotification] = useState<NotificationDTO | null>(null);
    const [sender, setSender] = useState<UtilisateurDto>();
    const [loading, setLoading] = useState(false);

    const socketContext = useSocket();

    let dismiss: ((NotificationId: number) => void) | undefined;

    if (socketContext) {
        dismiss = socketContext.dismiss;
    }

    useEffect(() => {
        if (selectedNotification) {
            setLoading(true);
            axiosInstance.get(USER_URL + `${selectedNotification.sender}`)
                .then(response => {
                    setSender(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                });
        }
    }, [selectedNotification]);

    const [menuVisible, setMenuVisible] = useState(true);

    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [t, i18n] = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
        const storedLanguage = Cookies.get('appLanguage');
        return storedLanguage || 'fr';
    });
    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language);
        setSelectedLanguage(language);
        setIsLanguageMenuOpen(false);
        Cookies.set('appLanguage', language);
    };


    const authService = new AuthService();
    const { connectedUser, setConnectedUser } = useConnectedUserStore();

    const signOut = async () => {
        try {
            await axiosInstance.put(`${process.env.NEXT_PUBLIC_CONNEXION_URL}update-status/${connectedUser!.username}`);
            authService.signOut();
            setConnectedUser(null);
            queryClient.invalidateQueries();
            localStorage.removeItem(INITIAL_LOAD_KEY);
            router.push("/auth");
        } catch (error) {
            console.error('Error updating connexion status:', error);
        }
    }

    const handleActivitéVisibility = (isVisible: boolean) => {
        const container = document.querySelector('.layout-main-container');
        if (container) {
            if (isVisible) {
                container.classList.add('with-activité');
            } else {
                container.classList.remove('with-activité');
            }
        }
    };
    const toggleActivite = () => {
        setActiviteVisible(!activiteVisible);
        handleActivitéVisibility(!activiteVisible);
    };
    const itemRenderer = (item: any) => (
        <a className="flex align-items-center p-menuitem-link" onClick={item.command}>
            <span className={item.icon} />
            {item.image && <img src={item.image} alt="Flag" width={22} height={22} />}
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} severity={"success"} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );

    const {audits} = useAuditStore(state => state);
    const [auditsToday, setAuditsToday] = useState<number>(0);
    useEffect(() => {
        const today = new Date();
        const auditsForToday = Array.isArray(audits) ? audits.filter(audit => {
            const createdOn = new Date(audit.createdOn[0], audit.createdOn[1] - 1, audit.createdOn[2]);
            return createdOn.getDate() === today.getDate() && createdOn.getMonth() === today.getMonth() && createdOn.getFullYear() === today.getFullYear();
        }) : [];
        setAuditsToday(auditsForToday.length);
    }, [audits]);
    const items = [
        {
            label: t('activités'),
            icon: 'pi pi-calendar-times',
            badge: auditsToday,
            template: itemRenderer,
            command: () => {
                toggleActivite();
            }

        },
        {
            label: t('Langue'),
            icon: 'pi pi-language',
            items: [
                {
                    label: t("appBar.french"),
                    image: "/la-france.png",
                    command: () => {
                        handleLanguageChange('fr');
                    },
                    template: itemRenderer,
                },
                {
                    label: t("appBar.english"),
                    image: "/royaume-uni.png",
                    command: () => {
                        handleLanguageChange('en');
                    },
                    template: itemRenderer,
                },
                {
                    label: t("appBar.arabic"),
                    image: "/maroc.png",
                    command: () => {
                        handleLanguageChange('ar');
                    },
                    template: itemRenderer,
                }
            ]
        },
        {
            label: t('Profile'),
            icon: 'pi pi-user-edit',
            command: () => {
                router.push('/profile');
            }
        },
        {
            separator: true
        },
        {
            label: t("appBar.signOut"),
            icon: 'pi pi-sign-out',
            command: () => {
                signOut();
            }
        }
    ];

    const unreadNotifications = socketContext?.notifications.filter(notification => !notification.read).length ?? 0;

    const {profilePicture} = useConnectedUserStore(state => state);

    return (
        <div className="layout-topbar">
            {/* <Link href="/dashboard" className="layout-topbar-logo">
                <img src='/Images/logodmp(2).svg' style={{ width:"5rem", marginRight:"1rem" }} alt="logo" />
                <img src='/Images/logodmp-title.svg' style={{ width:"10rem" }} alt="logo" />
            </Link> */}
            <Link href="/dashboard" className="layout-topbar-logo">
                <img src='/Images/logo-yan.png' style={{ width: "25%", height: '15%' }} alt="logo" />
                <span>YANDOC</span>
                <p className='text-xs mt-4 ml-2'>Solution</p>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button ml-7" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            {menuVisible && <div className='layout-sidebar-icon'><AppMenuICon /></div>}

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" onClick={(e) => (menu.current as any)?.toggle(e)} />
            </button>



            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className='ml-auto mr-4 p-overlay-badge'>
                    <NotificationIndicator setSelectedNotification={setSelectedNotification} />
                    {unreadNotifications > 0 &&
                        <Badge
                            className="ml-auto mt-2 mr-2"
                            value={unreadNotifications > 10 ? '10+' : unreadNotifications}
                            style={{ backgroundColor: 'red' }}
                            size={"normal"}
                        />}
                    <Dialog
                        visible={selectedNotification !== null}
                        onHide={() => setSelectedNotification(null)}
                        header={selectedNotification ? selectedNotification.summary : ''}
                        footer={
                            <div>
                                <Button
                                    label="Rejetter"
                                    icon="pi pi-times"
                                    onClick={() => {
                                        if (dismiss && selectedNotification) {
                                            dismiss(selectedNotification.id);
                                        }
                                        setSelectedNotification(null);
                                    }}
                                    className="p-button-danger p-button-text"
                                />
                                <Button
                                    label="Confirmer"
                                    icon="pi pi-check"
                                    onClick={() => {
                                        setSelectedNotification(null);
                                    }}
                                    className="p-button-success"
                                />
                            </div>
                        }
                    >
                        {selectedNotification && (
                            <div>
                                <p>{selectedNotification.detail}</p>
                                <div className="flex justify-content-start">
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <Chip
                                            label={sender ? sender.username : ''}
                                            icon="pi pi-user"
                                            className="p-mt-3"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </Dialog>
                </div>
                <div className="user-profile p-overlay-badge mt-1" onClick={(e) => (menu.current as any)?.toggle(e)}>
                    <Chip
                        label={`${connectedUser?.prenom} ${connectedUser?.nom}`}
                        icon="pi pi-user"
                        template={() => (
                            <>
                                <img
                                    src={profilePicture ?? '/user-avatar.png'}
                                    alt={connectedUser?.prenom}
                                    className="p-overlay-badge-image"
                                    onError={(e: any) => {
                                        e.target.src = '/user-avatar.png';
                                    }}
                                />
                                <p className='font-semibold'>
                                    {`${connectedUser?.prenom} ${connectedUser?.nom}`}
                                </p>
                            </>
                        )}
                        className="text-lg"
                    />
                    {auditsToday > 0 &&
                        <Badge
                            className="ml-auto mt-2"
                            value={auditsToday > 10 ? '10+' : auditsToday}
                            style={{ backgroundColor: 'red' }}
                            size={"normal"}
                        />}
                    <TieredMenu model={items} popup ref={menu} breakpoint="767px" className='ml-4 mt-2' />
                </div>
                {activiteVisible && <div className="layout-sidebar-activité">
                    <button type="button" className="p-link layout-menu-button layout-topbar-button" onClick={toggleActivite}>
                        <i className="pi pi-times" />
                    </button>
                    <AppActivité />
                </div>}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
