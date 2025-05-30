package ma.sir.ged.WebSocket.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

import ma.sir.ged.WebSocket.Services.WsDispatcher;

@RestController
public class WsController {

    @Autowired
    private WsDispatcher wsDispatcher;

    @MessageMapping("/start")
    public void start(StompHeaderAccessor stompHeaderAccessor) {
        wsDispatcher.add(stompHeaderAccessor.getSessionId());
    }

    @MessageMapping("/stop")
    public void stop(StompHeaderAccessor stompHeaderAccessor) {
        wsDispatcher.remove(stompHeaderAccessor.getSessionId());
    }
}
