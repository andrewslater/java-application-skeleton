package com.andrewslater.example;

import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.repositories.SystemSettingsRepository;
import com.andrewslater.example.security.ExampleAuthenticationSuccessHandler;
import com.andrewslater.example.security.ExampleUserDetailsService;
import com.andrewslater.example.security.UserConfirmationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(SecurityConfiguration.class);

    @Autowired
    private ExampleUserDetailsService userDetailsService;

    @Autowired
    private SystemSettingsRepository systemSettingsRepository;

    @Autowired
    private ExampleAuthenticationSuccessHandler authenticationSuccessHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
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
                .antMatchers("/**").hasRole("USER")
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
            .rememberMe()
                .and()
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
        return systemSettingsRepository.getSystemSettings();
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
