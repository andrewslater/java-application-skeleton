package com.andrewslater.example;

import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.security.ApplicationUserDetailsService;
import com.andrewslater.example.security.AuthenticationSuccessHandler;
import com.andrewslater.example.security.UserConfirmationFilter;
import com.andrewslater.example.services.SystemSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled=true, jsr250Enabled=true)
@EnableWebSecurity
@Order(2)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(SecurityConfiguration.class);

    @Autowired
    private ApplicationUserDetailsService userDetailsService;

    @Autowired
    private SystemSettingsService systemSettingsService;

    @Autowired
    private AuthenticationSuccessHandler authenticationSuccessHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
            .requestMatchers()
            .   regexMatchers("^(?!/api).*$")
                .and()
            .authorizeRequests()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/js/**").permitAll()
                .antMatchers("/i18n/**").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/logout").permitAll()
                .antMatchers("/unconfirmed").permitAll()
                .antMatchers("/confirm").permitAll()
                .antMatchers("/register").anonymous()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user-file/**").hasRole("USER")
                .antMatchers("/**/**").hasRole("USER")
                .anyRequest().fullyAuthenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler(authenticationSuccessHandler)
                .permitAll()
                .and()
            .logout()
                .logoutUrl("/logout")
                .invalidateHttpSession(true)
                .logoutSuccessUrl("/")
                .and()
            .csrf()
                .ignoringAntMatchers("/api/**")
                .and()
            .rememberMe()
                .and()
//            .requiresChannel()
//                .anyRequest()
//                .requiresSecure()
//                .and()
            .addFilterAfter(new UserConfirmationFilter(), SecurityContextHolderAwareRequestFilter.class);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService)
            .passwordEncoder(new BCryptPasswordEncoder());
    }

    @Bean
    @Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
    public SystemSettings systemSettings() {
        return systemSettingsService.getSystemSettings();
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
