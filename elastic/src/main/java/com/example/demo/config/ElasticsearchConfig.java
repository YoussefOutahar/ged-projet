package com.example.demo.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.reactor.IOReactorConfig;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;


@Slf4j
@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {
    @Value("${elasticsearch.hostname}")
    String hostName;
    @Value("${elasticsearch.port}")
    Integer port;

    @Value("${elasticsearch.username}")
    String username;
    @Value("${elasticsearch.password}")
    String password;
    @Bean
    public RestHighLevelClient elasticsearchClient2() {
        log.info("elastic : {} : {}", hostName, port);
        final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY,
                new UsernamePasswordCredentials(username, password));

        RestClientBuilder builder = RestClient.builder(new HttpHost(hostName, port, "https"))
                .setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder
                        .setDefaultIOReactorConfig(IOReactorConfig.custom()
                                .setSoKeepAlive(true)
                                .build())
                        .setDefaultCredentialsProvider(credentialsProvider));

        return new RestHighLevelClient(builder);
    }

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(hostName+":"+port)
                .usingSsl()
                .withBasicAuth(username,password)
                .build();
    }
}
