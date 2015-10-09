package com.andrewslater.example.api.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.APIView;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.exceptions.ForbiddenException;
import com.andrewslater.example.models.AvatarSize;
import com.andrewslater.example.models.Role;
import com.andrewslater.example.models.User;
import com.andrewslater.example.models.UserFile;
import com.andrewslater.example.repositories.UserRepository;
import com.andrewslater.example.security.SecurityUser;
import com.andrewslater.example.services.UserFilesService;
import com.andrewslater.example.services.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
public class AvatarAPIController {
    private static final Logger LOG = LoggerFactory.getLogger(AvatarAPIController.class);

    @Autowired
    private UserFilesService userFilesService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = Mappings.API_USER_AVATAR, method = RequestMethod.POST)
    @JsonView(APIView.Authenticated.class)
    public HttpEntity<UserResource> uploadAvatar(@PathVariable Long userId,
                                                 @AuthenticationPrincipal SecurityUser securityUser,
                                                 @RequestBody BufferedImage image) throws IOException {
        User principal = securityUser.getUser();

        if (!principal.getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

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

        BufferedImage mediumImage = Scalr.resize(image, Scalr.Method.ULTRA_QUALITY, AvatarSize.MEDIUM.getSize());
        BufferedImage smallImage = Scalr.resize(image, Scalr.Method.ULTRA_QUALITY, AvatarSize.SMALL.getSize());
        BufferedImage microImage = Scalr.resize(image, Scalr.Method.ULTRA_QUALITY, AvatarSize.MICRO.getSize());

        UserFile largeAvatar = userFilesService.createUserFile(user, "avatar-large.png", image);
        UserFile mediumAvatar = userFilesService.createUserFile(user, "avatar-medium.png", mediumImage);
        UserFile smallAvatar = userFilesService.createUserFile(user, "avatar-small.png", smallImage);
        UserFile microAvatar = userFilesService.createUserFile(user, "avatar-micro.png", microImage);

        user.setLargeAvatar(largeAvatar);
        user.setMediumAvatar(mediumAvatar);
        user.setSmallAvatar(smallAvatar);
        user.setMicroAvatar(microAvatar);

        return userService.getResponseEntity(userService.update(user));
    }

    @RequestMapping(value = Mappings.API_AVATAR_SIZES, method = RequestMethod.GET)
    public List<AvatarSize> getSizes() {
        return Arrays.asList(AvatarSize.values());
    }
}
