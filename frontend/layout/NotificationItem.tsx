import { ContextMenu } from "primereact/contextmenu";
import { NotificationDTO } from "./NotificatioDto";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "primereact/badge";
import { useSocket } from "./context/SocketProvider";


interface Props {
    notification: NotificationDTO;
}

const NotificationItem = ({ notification }: Props) => {
    const socket = useSocket();

    const handleDismiss = () => {
        socket?.dismiss && socket.dismiss(notification.id);
    };

    const handleMarkAsRead = () => {
        socket?.markAsRead && socket.markAsRead(notification.id);
    };

    const [icon, setIcon] = useState<string>('');
    const [color, setColor] = useState<string>('');

    const [menu, setMenu] = useState(null);
    const cm = useRef(null);
    const showMenu = (event: any) => {
        if (cm.current) {
            (cm.current as ContextMenu).show(event);
        }
        setMenu(event);
    };

    const [contextMenuVisible, setContextMenuVisible] = useState(false);

    const [isHovering, setIsHovering] = useState<boolean>(false);

    function getTimePeriod(createdAt: Date | string) {
        const createdAtDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
        const period = formatDistanceToNow(createdAtDate, { addSuffix: false, locale: fr });
        return `Il y a ${period}`;
    }

    useEffect(() => {
        switch (notification.severity) {
            case 'info':
                setIcon('pi-info-circle');
                setColor('blue');
                break;
            case 'success':
                setIcon('pi-check-circle');
                setColor('green');
                break;
            case 'warn':
                setIcon('pi-exclamation-triangle');
                setColor('yellow');
                break;
            case 'error':
                setIcon('pi-times-circle');
                setColor('red');
                break;
            default:
                setIcon('pi-info-circle');
                setColor('blue');
                break;
        }
    }, []);

    return (
        <li
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            key={notification.id}
            className="flex align-items-center py-2 border-bottom-1 surface-border"
        >

            <div className={`w-3rem h-3rem flex align-items-center justify-content-center bg-${color}-100 border-circle mr-3 flex-shrink-0`}>
                <i className={`pi ${icon} p-overlay-badge text-xl text-${color}-500`} >
                    {notification.read ? null : <Badge className="-m-2" value="!" severity="danger" size="normal" />}
                </i>
            </div>

            <span className="flex-grow-1 text-600 line-height-2 m-1">
                <span className="text-lg font-semibold mb-2">{notification.summary}</span>
                <br />
                <span className="text-md" >{notification.detail}</span>
                <br />
                <div className="flex justify-content-end">
                    <span>{getTimePeriod(notification.createdAt)}</span>
                </div>
            </span>

            <button
                type="button"
                className="p-link layout-topbar-button ml-3"
                aria-controls="popup_menu"
                aria-haspopup="true"
                onClick={showMenu}
            >
                <i className="pi pi-ellipsis-h text-2xl"></i>
            </button>

            <ContextMenu
                ref={cm}
                appendTo={document.body}
                id="popup_menu"
                onHide={() => setContextMenuVisible(false)}
                style={{
                    maxHeight: "300px",
                    overflow: "auto",
                    scrollbarWidth: "none",
                    borderColor: "#888",
                    borderRadius: "1rem",
                    boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.1), 0 0 2rem 0 rgba(0, 0, 0, 0.2)",
                }}

                model={[
                    {
                        label: 'Muarquer comme lue',
                        icon: 'pi pi-check',
                        command: () => {
                            handleMarkAsRead();
                        }
                    },
                    {
                        label: 'Supprimer',
                        icon: 'pi pi-times',
                        command: () => {
                            handleDismiss();
                        }
                    },
                ]}
            >

            </ContextMenu>
        </li>
    );
}

export default NotificationItem;