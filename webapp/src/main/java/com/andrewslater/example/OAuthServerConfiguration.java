package com.andrewslater.example;

import com.andrewslater.example.security.ApplicationUserDetailsService;
import com.andrewslater.example.security.UserConfirmationAPIFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import org.springframework.security.oauth2.provider.code.AuthorizationCodeServices;
import org.springframework.security.oauth2.provider.code.JdbcAuthorizationCodeServices;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;

@Configuration
public class OAuthServerConfiguration {

    public static final String RESTSERVICE_RESOURCE_ID = "restservice";

    @Configuration
    @EnableResourceServer
    protected static class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
        private static final Logger LOG = LoggerFactory.getLogger(ResourceServerConfiguration.class);

        @Autowired
        private TokenStore tokenStore;

        @Override
        public void configure(ResourceServerSecurityConfigurer resources) {
            resources
                .tokenStore(tokenStore)
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
                .formLogin()
                    .disable()
                .csrf()
                    .ignoringAntMatchers("/api/**")
                    .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .sessionFixation().none()
                    .and()
                .requiresChannel()
                    .anyRequest()
                    .requiresSecure()
                    .and()
                .addFilterAfter(new UserConfirmationAPIFilter(), SecurityContextHolderAwareRequestFilter.class);
        }
    }

    @Configuration
    @EnableAuthorizationServer
    protected static class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {
        private static final Logger LOG = LoggerFactory.getLogger(AuthorizationServerConfig.class);

        @Autowired @Qualifier("authenticationManagerBean")
        private AuthenticationManager authenticationManager;

        @Autowired
        private ApplicationUserDetailsService userDetailsService;

        @Autowired
        private DataSource dataSource;

        @Value("${oauth2.clients.webapp.secret}")
        private String webappClientSecret;

        @Value("${oauth2.clients.webapp.name}")
        private String webappClientName;

        @Override
        public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints
                .authorizationCodeServices(authorizationCodeServices())
                .authenticationManager(authenticationManager)
                .tokenStore(tokenStore())
                .approvalStoreDisabled()
                .userDetailsService(userDetailsService);
        }

        @Override
        public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            if (StringUtils.isEmpty(webappClientName)) {
                throw new Exception(
                    "You must specify the oauth client name property: oauth2.clients.webapp.name");
            }

            if (StringUtils.isEmpty(webappClientSecret)) {
                throw new Exception(
                    "You must specify the oauth client secret property: oauth2.clients.webapp.secret");
            }

            clients.jdbc(dataSource);
        }

        @Bean
        public JdbcTokenStore tokenStore() {
            JdbcTokenStore tokenStore = new JdbcTokenStore(dataSource);
            return tokenStore;
        }

        @Bean
        protected AuthorizationCodeServices authorizationCodeServices() {
            return new JdbcAuthorizationCodeServices(dataSource);
        }

        @Bean
        public DefaultTokenServices tokenServices() {
            DefaultTokenServices tokenServices = new DefaultTokenServices();
            tokenServices.setSupportRefreshToken(false);
            tokenServices.setTokenStore(tokenStore());
            return tokenServices;
        }
    }
}
