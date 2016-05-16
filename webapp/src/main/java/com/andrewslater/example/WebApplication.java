package com.andrewslater.example;

import com.andrewslater.example.converters.Base64EncodedImageHttpMessageConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.time.ZoneId;
import java.util.List;
import java.util.TimeZone;

@SpringBootApplication
@PropertySource("classpath:git.properties")
@EnableAsync
public class WebApplication extends WebMvcConfigurerAdapter implements ApplicationContextAware {

    private static final Logger LOG = LoggerFactory.getLogger(WebApplication.class);

    @Value("${git.commit.id.describe}")
    private String buildCommit;

    @Value("${git.build.time}")
    private String buildTime;

    @Value("${git.branch}")
    private String buildBranch;

    @Value("${server.insecure.port}")
    private Integer insecurePort;

    @Value("${server.secure.port}")
    private Integer securePort;

    @Value("${info.build.version}")
    private String version;

    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

    @Bean
    public ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames("classpath:/static/i18n/messages");
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

    @Override public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        LOG.info("Version: {}", version);
        LOG.info("Latest commit: {} on branch '{}' Build date: {}", buildCommit, buildBranch, buildTime);
        TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.of("UTC")));
    }
}
