package ma.sir.ged.config.WebSocket;

import java.security.Principal;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

    @Bean
    UserHandShakeInterceptor userHandShakeInterceptor() {
        return new UserHandShakeInterceptor();
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/api/ws")
            .setHandshakeHandler(handshakeHandler())
            .setAllowedOriginPatterns("*")
            .addInterceptors(userHandShakeInterceptor());

        registry
            .addEndpoint("/api/ws")
            .setHandshakeHandler(handshakeHandler())
            .setAllowedOriginPatterns("*")
            .withSockJS()
            .setInterceptors(userHandShakeInterceptor());
    }

    @Override
    public void configureMessageBroker( MessageBrokerRegistry config){
        config.setApplicationDestinationPrefixes("/app");
        config.enableSimpleBroker( "/topic", "/queue");
    }



    @Bean
    DefaultHandshakeHandler handshakeHandler() {
        return new DefaultHandshakeHandler() {
            @Override
            protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
                    Map<String, Object> attributes) {
                        
                return new Principal() {
                    @Override
                    public String getName() {
                        return (String) attributes.get(UserHandShakeInterceptor.getAttrPrincipal());
                    }
                };
            }
        };
    }
}
