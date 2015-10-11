package com.andrewslater.example.services;

import com.andrewslater.example.api.ModelPatcher;
import com.andrewslater.example.api.assemblers.UserResourceAssembler;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.forms.RegistrationForm;
import com.andrewslater.example.models.AvatarSize;
import com.andrewslater.example.models.Role;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.models.User;
import com.andrewslater.example.models.UserFile;
import com.andrewslater.example.repositories.UserRepository;
import org.imgscalr.Scalr;
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
import java.awt.image.BufferedImage;
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
    private ModelPatcher modelPatcher;

    @Autowired
    private UserFilesService userFilesService;

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
        userRepository.saveAndFlush(user);
        return user;

    }

    public User patchUser(User user) {
        if (user.getUserId() == null) {
            throw new RuntimeException("No user id specified for user to patch: " + user.toString());
        }

        User existingUser = userRepository.findOne(user.getUserId());

        if (existingUser == null) {
            throw new RuntimeException("Unable to find existing user to patch with id " + user.getUserId());
        }

        modelPatcher.patchModel(existingUser, user);
        return userRepository.save(existingUser);
    }

    public User updateUserAvatar(Long userId, BufferedImage image) {
        User user = userRepository.getOne(userId);
        int requiredDimension = AvatarSize.getLargestSize().getSize();

        if (image.getWidth() != requiredDimension || image.getHeight() != requiredDimension ) {
            String errorMessage = String.format("Provided image has incorrect dimensions (%dx%d). Must be %dx%d",
                image.getWidth(),
                image.getHeight(),
                requiredDimension,
                requiredDimension);
            throw new RuntimeException(errorMessage);
        }

        BufferedImage mediumImage = scaleImage(image, AvatarSize.MEDIUM.getSize());
        BufferedImage smallImage = scaleImage(image, AvatarSize.SMALL.getSize());
        BufferedImage microImage = scaleImage(image, AvatarSize.MICRO.getSize());

        UserFile largeAvatar = userFilesService.createUserFile(user, "avatar-large.png", image);
        UserFile mediumAvatar = userFilesService.createUserFile(user, "avatar-medium.png", mediumImage);
        UserFile smallAvatar = userFilesService.createUserFile(user, "avatar-small.png", smallImage);
        UserFile microAvatar = userFilesService.createUserFile(user, "avatar-micro.png", microImage);

        user.setLargeAvatar(largeAvatar);
        user.setMediumAvatar(mediumAvatar);
        user.setSmallAvatar(smallAvatar);
        user.setMicroAvatar(microAvatar);

        return update(user);
    }

    private BufferedImage scaleImage(BufferedImage image, int targetSize) {
        return Scalr.resize(image, Scalr.Method.ULTRA_QUALITY, targetSize);
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
