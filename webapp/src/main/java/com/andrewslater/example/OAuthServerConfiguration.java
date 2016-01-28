package com.andrewslater.example;

import com.andrewslater.example.security.ExampleUserDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.InMemoryTokenStore;
import org.springframework.util.StringUtils;

@Configuration
public class OAuthServerConfiguration {

    public static final String RESTSERVICE_RESOURCE_ID = "restservice";

    @Configuration
    @EnableResourceServer
    @Order(2)
    protected static class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
        private static final Logger LOG = LoggerFactory.getLogger(ResourceServerConfiguration.class);

        @Override
        public void configure(ResourceServerSecurityConfigurer resources) {
            resources
                .resourceId(RESTSERVICE_RESOURCE_ID);
        }

        @Override
        public void configure(HttpSecurity http) throws Exception {
            http
                .requestMatchers()
                    .antMatchers("/api/**")
                    .and()
                .authorizeRequests()
                    .antMatchers("/api/admin/**").hasRole("ADMIN")
                    .antMatchers("/api/**").hasRole("USER")
                    .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .sessionFixation().none();
        }
    }

    @Configuration
    @EnableAuthorizationServer
    protected static class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

        private TokenStore tokenStore = new InMemoryTokenStore();

        @Autowired @Qualifier("authenticationManagerBean") private AuthenticationManager
            authenticationManager;

        @Autowired private ExampleUserDetailsService userDetailsService;

        @Value("${oauth2.clients.webapp.secret}") private String webappClientSecret;

        @Value("${oauth2.clients.webapp.name}") private String webappClientName;

        @Override public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints.tokenStore(tokenStore).authenticationManager(authenticationManager)
                .userDetailsService(userDetailsService);
        }

        @Override public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            if (StringUtils.isEmpty(webappClientName)) {
                throw new Exception(
                    "You must specify the oauth client name property: oauth2.clients.webapp.name");
            }

            if (StringUtils.isEmpty(webappClientSecret)) {
                throw new Exception(
                    "You must specify the oauth client secret property: oauth2.clients.webapp.secret");
            }

            clients.inMemory().withClient(webappClientName)
                .authorizedGrantTypes("password", "refresh_token").authorities("USER")
                .scopes("read", "write").resourceIds(RESTSERVICE_RESOURCE_ID)
                .secret(webappClientSecret);
        }

        @Bean @Primary public DefaultTokenServices tokenServices() {
            DefaultTokenServices tokenServices = new DefaultTokenServices();
            tokenServices.setSupportRefreshToken(false);
            tokenServices.setTokenStore(tokenStore);
            return tokenServices;
        }
    }

}
