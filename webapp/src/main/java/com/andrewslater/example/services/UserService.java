package com.andrewslater.example.services;

import com.andrewslater.example.api.assemblers.UserResourceAssembler;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.forms.RegistrationForm;
import com.andrewslater.example.models.Role;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.models.User;
import com.andrewslater.example.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class UserService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    private UserRepository userRepository;
    private JavaMailSender mailSender;
    private TemplateEngine templateEngine;

    @Autowired
    private SystemSettings systemSettings;

    @Autowired
    @Qualifier("userResourceAssembler")
    private UserResourceAssembler userAssembler;

    @Autowired
    public UserService(UserRepository repository,
        JavaMailSender mailSender,
        TemplateEngine templateEngine) {
        this.userRepository = repository;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public User create(RegistrationForm form) {
        User user = new User();
        user.setEmail(form.getEmail());
        user.setFullName(form.getFullName());
        user.setPassword(new BCryptPasswordEncoder().encode(form.getPassword()));
        user.getRoles().clear();
        user.getRoles().add(Role.USER);
        user.setEnabled(true);
        user.setRequiresConfirmation(systemSettings.isRequireEmailConfirmation());

        if (user.requiresAccountConfirmation()) {
            user.setEmailPendingConfirmation(user.getEmail());
        }

        user = userRepository.save(user);
        sendInitialEmail(user);
        return user;
    }

    public User update(User user) {
        return userRepository.save(user);
    }

    public User recordLastLogin(User user) {
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return user;

    }

    public ResponseEntity<UserResource> getResponseEntity(User user) {
        return new ResponseEntity<>(userAssembler.toResource(user), HttpStatus.OK);
    }

    private void sendInitialEmail(User user) {
        LOG.debug("Sending initial email to {}", user.getEmail());
        if (user.requiresAccountConfirmation()) {
            sendConfirmationEmail(user);
        } else {
            sendWelcomeEmail(user);
        }
    }

    @Async
    private void sendConfirmationEmail(User user) {
        LOG.debug("Sending confirmation email for user {}", user.getEmail());

        // TODO: Correctly formulate confirmationLink
        final Context ctx = new Context(Locale.US);
        ctx.setVariable("user", user);
        ctx.setVariable("confirmationLink", "http://localhost:8080/confirm");

        final MimeMessage mimeMessage = this.mailSender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

        try {
            helper.setSubject("Welcome to the Java Skeleton Application Webapp");
            helper.setFrom("noreply@example.com");
            helper.setTo(user.getEmail());

            // TODO: fix error when trying to send confirmation email
            final String htmlContent = templateEngine.process("emails/user_confirmation", ctx);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException ex) {
            LOG.error("Failed to send confirmation email to user: {}", user);
        }
    }

    @Async
    private void sendWelcomeEmail(User user)  {
        // TODO: Send welcome email
    }

    public User confirmUser(String token) {
        User user = userRepository.findByConfirmationToken(token);

        if (user != null) {
            user = confirmUser(user);
        }

        return user;
    }

    public User confirmUser(User user) {
        if (user.emailChangeIsPending()) {
            user.setEmail(user.getEmailPendingConfirmation());
        }
        user.setEmailPendingConfirmation(null);
        user.setConfirmationToken(null);


        return userRepository.save(user);
    }
}
