package ma.sir.ged.WebSocket.Services;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import ma.sir.ged.WebSocket.Beans.Payload;
import ma.sir.ged.bean.core.organigramme.Utilisateur;

@Service
public class WsDispatcher {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcast(Payload payload){
        messagingTemplate.convertAndSend("/topic/messages", payload);
    }

    public void dispatchToUser(Payload payload){
        messagingTemplate.convertAndSendToUser(payload.getSender().getUsername(), "/topic/messages", payload);
    }

    public void dispatchToUser(String username, Payload payload){
        messagingTemplate.convertAndSendToUser(username, "/topic/messages", payload);
    }

    public void dispatchToUser(Set<Utilisateur> users,Payload payload){
        users.forEach(user -> {
            messagingTemplate.convertAndSendToUser(user.getUsername(), "/topic/messages", payload);
        });
    }

    private Set<String> listeners = new HashSet<>();

    public void add(String sessionId) {
        listeners.add(sessionId);
    }

    public void remove(String sessionId) {
        listeners.remove(sessionId);
    }

    @Scheduled(fixedDelay = 2000)
    public void dispatch() {
        for (String listener : listeners) {
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
            headerAccessor.setSessionId(listener);
            headerAccessor.setLeaveMutable(true);

            Payload payload = new Payload();

            messagingTemplate.convertAndSendToUser(
                    listener,
                    "/notification/item",
                    payload,
                    headerAccessor.getMessageHeaders());
        }
    }

    @EventListener
    public void sessionDisconnectionHandler(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        remove(sessionId);
    }
}
