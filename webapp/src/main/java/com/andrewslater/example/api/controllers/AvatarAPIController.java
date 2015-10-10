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
    @JsonView(APIView.Owner.class)
    public HttpEntity<UserResource> uploadAvatar(@PathVariable Long userId,
                                                 @AuthenticationPrincipal SecurityUser securityUser,
                                                 @RequestBody BufferedImage image) throws IOException {
        User principal = securityUser.getUser();

        if (!principal.getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        return userService.updateUserAvatar(userId, image);
    }

    @RequestMapping(value = Mappings.API_AVATAR_SIZES, method = RequestMethod.GET)
    public List<AvatarSize> getSizes() {
        return Arrays.asList(AvatarSize.values());
    }
}
