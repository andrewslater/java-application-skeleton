package com.andrewslater.example;

import com.andrewslater.example.react.ReactEngine;
import com.andrewslater.example.react.ReactEngineFactory;
import org.apache.catalina.connector.Connector;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableAutoConfiguration
@EnableWebMvcSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@ComponentScan
public class WebApplication extends WebMvcConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(WebApplication.class);

    @Value("${server.tomcat.max-threads}")
    private int maxTomcatThreads;

    @Autowired
    private ReactEngineFactory reactEngineFactory;

    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

    @Bean
    public ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames("resources/i18n/messages");
        LOG.debug("MessageSource: {}", messageSource);
        return messageSource;
    }

    @Bean
    public EmbeddedServletContainerFactory servletContainer() {
        TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory();
        tomcat.addConnectorCustomizers(new TomcatConnectorCustomizer() {
            @Override public void customize(Connector connector) {

            }
        });
        return tomcat;
    }

    @Bean
    public GenericObjectPool<ReactEngine> reactEnginePool() {
        GenericObjectPool<ReactEngine> pool = new GenericObjectPool<>(reactEngineFactory);
        pool.setMinIdle(maxTomcatThreads);
        pool.setMaxIdle(maxTomcatThreads);
        return pool;
    }

    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }
}
