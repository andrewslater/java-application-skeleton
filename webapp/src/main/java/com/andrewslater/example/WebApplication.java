package com.andrewslater.example;

import com.andrewslater.example.converters.Base64EncodedImageHttpMessageConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

@Configuration
@EnableAutoConfiguration
@EnableWebMvcSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@ComponentScan
public class WebApplication extends WebMvcConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(WebApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

    @Bean
    public ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames("classpath:/static/i18n/messages");
        LOG.debug("MessageSource: {}", messageSource);
        return messageSource;
    }

    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }

    @Override
    public void configureMessageConverters(
        List<HttpMessageConverter<?>> converters) {

        converters.add(getImageConverter());
        super.configureMessageConverters(converters);
    }

    @Bean Base64EncodedImageHttpMessageConverter getImageConverter() {
        return new Base64EncodedImageHttpMessageConverter();
    }
}
