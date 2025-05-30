package ma.sir.ged.config;

import org.apache.coyote.http11.AbstractHttp11Protocol;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
        return (factory) -> factory.addConnectorCustomizers((connector) -> {
            if (connector.getProtocolHandler() instanceof AbstractHttp11Protocol<?>) {
                ((AbstractHttp11Protocol<?>) connector.getProtocolHandler()).setMaxSwallowSize(209715200); // 200 MB
                ((AbstractHttp11Protocol<?>) connector.getProtocolHandler()).setMaxKeepAliveRequests(100);
                ((AbstractHttp11Protocol<?>) connector.getProtocolHandler()).setConnectionTimeout(20000);
            }
            connector.setMaxPostSize(209715200); // 200 MB
            connector.setAttribute("maxThreads", 200);
            connector.setAttribute("acceptCount", 100);
        });
    }
}
