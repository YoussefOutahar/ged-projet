import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { MessageService } from 'app/zynerator/service/MessageService';
import axiosInstance from 'app/axiosInterceptor';
import { Toast } from 'primereact/toast';
import { NotificationDTO } from 'layout/NotificatioDto';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = API_URL + "/ws";
const NOTIFICATIONS_URL = API_URL + "/notifications";

const stompConfig = {
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const toast = useRef<Toast>(null);
  const toastBanner = useRef<Toast>(null);

  const subscribeToNotifications = (client: any) => {
    client.subscribe("/topic/notifications/all", (message: any) => {
      if (message.body) {
        const notification: NotificationDTO = JSON.parse(message.body);

        if (notification.summary === "LICENCE-EXPIRATION-BANNER") {
          MessageService.showBanner(toastBanner, "Licence Expiration", notification.detail, notification.severity);
        } else {
          setNotifications((prevNotifications) => [...prevNotifications, notification]);
          MessageService.showToast(toast, {
            severity: notification.severity,
            summary: notification.summary,
            detail: notification.detail,
            life: 3000,
          });
        }
      }
    });
  };


  useEffect(() => {
      axiosInstance.get(`${API_URL}/licence-validation/about-to-expire`).then((response) => {
        if ((response.data as string).includes("La licence de l'application va expirer dans ") ) {
          MessageService.showBanner(toastBanner, "Licence Expiration", response.data, "error")
        }
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  const subcribeToUserNotifications = (client: any) => {
    client.subscribe('/user/topic/notifications/private', (message: any) => {
      if (message.body) {
        const notification: NotificationDTO = JSON.parse(message.body);
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
        MessageService.showToast(toast, {
          severity: notification.severity,
          summary: notification.summary,
          detail: notification.detail,
          life: 3000,
        });
      }
    });
  }

  const getUserNotifications = () => {
    axiosInstance.get(NOTIFICATIONS_URL + "/specific").then((response) => {
      setNotifications(response.data.filter((notification: NotificationDTO) => !notification.dismissed));
    });
  };

  const markAsRead = (id: number) => {
    axiosInstance.put(NOTIFICATIONS_URL + "/read/" + id).then(() => {
      const notificationIndex = notifications.findIndex(notification => notification.id === id);
      if (notificationIndex !== -1) {
        const newNotifications = [...notifications];
        newNotifications[notificationIndex].read = true;
        setNotifications(newNotifications);
      }
    });
  };

  const dismiss = (NotificationId: number) => {
    axiosInstance.put(NOTIFICATIONS_URL + "/dismiss/" + NotificationId).then(() => {
      setNotifications(notifications.filter((notification) => notification.id !== NotificationId));
    });
  };

  const dismissAll = () => {
    axiosInstance.put(NOTIFICATIONS_URL + "/dismiss/all").then(() => {
      setNotifications([]);
    });
  }

  const connectToSocket = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const stompClient = new Client({
        ...stompConfig,
        webSocketFactory: () => new SockJS(`${SOCKET_URL}?token=${token}`),
        onConnect: () => {
          subscribeToNotifications(stompClient);
          subcribeToUserNotifications(stompClient);
          getUserNotifications();
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
        },
        onDisconnect: () => {
          stompClient.deactivate();
          setClient(null);
        },
      });

      stompClient.activate();
      setClient(stompClient);

      return () => {
        if (stompClient.active) {
          stompClient.deactivate();
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };

  useEffect(() => {
    connectToSocket();
  }, []);

  return (
    <SocketContext.Provider value={{ client, notifications, dismiss, dismissAll, markAsRead }}>
      {children}
      <Toast ref={toast} />
      <Toast ref={toastBanner} position='bottom-center' />
    </SocketContext.Provider>
  );
};

const SocketContext = createContext<{
  client: Client | null;
  notifications: NotificationDTO[];
  dismiss: (NotificationId: number) => void;
  dismissAll: () => void;
  markAsRead: (id: number) => void;
} | null>(null);

export const useSocket = () => useContext(SocketContext);