package ma.sir.ged.config.WebSocket;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.zynerator.security.common.SecurityParams;

@RequiredArgsConstructor
public class UserHandShakeInterceptor implements HandshakeInterceptor {

    private static final String ATTR_PRINCIPAL = "__principal__";

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        
        String token = request.getURI().getQuery();
        String jwtToken = token.split("=")[1];
        String username = getUsernameFromRequest(jwtToken);
        attributes.put(ATTR_PRINCIPAL, username);
        if (request instanceof ServletServerHttpRequest) {
			ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
			HttpSession session = servletRequest.getServletRequest().getSession(false);
			if (session != null) {
				attributes.put("sessionId", session.getId());
			}
		}
        System.out.println(attributes.toString());
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Exception exception) {
    }

    public static String getAttrPrincipal() {
        return ATTR_PRINCIPAL;
    }

    private String getUsernameFromRequest(String jwtToken) {
        if (jwtToken != null && jwtToken.startsWith(SecurityParams.HEADER_PREFIX)) {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SecurityParams.SECRET)).build();
            String jwt = jwtToken.substring(SecurityParams.HEADER_PREFIX.length());
            DecodedJWT decodedJWT = verifier.verify(jwt);
            return decodedJWT.getSubject();
        }
        return null;
    }
}
