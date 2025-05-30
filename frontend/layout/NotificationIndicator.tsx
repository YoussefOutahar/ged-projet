import { useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useSocket } from "./context/SocketProvider";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataScroller } from 'primereact/datascroller';
import { NotificationDTO } from "./NotificatioDto";
import React from "react";
import NotificationItem from "./NotificationItem";
import { Button } from "primereact/button";

interface NotificationIndicatorProps {
    setSelectedNotification: (notification: NotificationDTO | null) => void;
}

const NotifactionsIcon: React.FC<NotificationIndicatorProps> = ({ setSelectedNotification }) => {

    const socket = useSocket();

    let client: Client | null = null;
    let notifications: NotificationDTO[] = [];
    let markAsRead: (NotificationId: number) => void;
    let dismissAll: () => void;

    if (socket) {
        ({ client, notifications, markAsRead, dismissAll } = socket);
    }

    const op = useRef<OverlayPanel | null>(null);
    const showMenu = (event: any) => {
        op.current?.toggle(event);
    };
    const dataScroller = useRef<DataScroller | null>(null);

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const groupByDate = (notifications: NotificationDTO[]) => {
        notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const map = new Map();
        notifications.forEach((item: NotificationDTO) => {
            const date = new Date(item.createdAt).toDateString();
            const collection = map.get(date);
            if (!collection) {
                map.set(date, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    };

    const footer = <button type="button" className="p-link layout-topbar-button" onClick={() => { dataScroller.current?.load() }}>
        <i className="pi pi-plus"></i>
    </button>;

    return (
        <div>

            <button type="button" className="p-link layout-topbar-button" onClick={showMenu}>
                <i className="pi pi-bell text-4xl"></i>
            </button>
            <OverlayPanel ref={op} showCloseIcon dismissable={false} style={{
                width: '30%',
                padding: '0',
                borderRadius: '1rem',
                boxShadow: '0 0 5px 0 rgba(0,0,0,0.2)',

            }}>
                <>
                    <div className="flex align-items-center justify-content-between">
                        <h5>Notifications</h5>
                        <Button
                            icon="pi pi-trash"
                            className="p-button-danger small"
                            size="small"
                            rounded
                            onClick={() => {
                                dismissAll();
                            }}
                        />
                    </div>
                    {notifications.length > 0
                        ?
                        <DataScroller
                            ref={dataScroller}
                            value={Array.from(groupByDate(notifications), ([date, notifications]) => ({ date, notifications }))}
                            // scrollHeight="300px"
                            footer={footer}
                            rows={1}
                            itemTemplate={(item) => {
                                let heading;
                                if (item.date === today) {
                                    heading = 'Aujourd\'hui';
                                } else if (item.date === yesterday) {
                                    heading = 'Hier';
                                } else {
                                    heading = item.date;
                                }
                                return <div>
                                    <span className="block text-600 font-medium mb-3">{heading}</span>
                                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                                        {item.notifications
                                            .filter((notification: NotificationDTO) => !notification.dismissed)
                                            .sort((a: NotificationDTO, b: NotificationDTO) => {
                                                if (a.read === b.read) {
                                                    let timestampA = new Date(a.createdAt);
                                                    let timestampB = new Date(b.createdAt);
                                                    return timestampA > timestampB ? -1 : 1;
                                                }
                                                return a.read ? 1 : -1;
                                            })
                                            .map((notification: NotificationDTO, index: number) => {
                                                return (
                                                    <NotificationItem key={index} notification={notification} />
                                                );
                                            })}
                                    </ul>
                                </div>
                            }}
                        />
                        : <p>Pas de notifications</p>}
                </>
            </OverlayPanel>
        </div>
    );
}

export default NotifactionsIcon;