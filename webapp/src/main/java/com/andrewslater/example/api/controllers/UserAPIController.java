package com.andrewslater.example.api.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.APIView;
import com.andrewslater.example.api.assemblers.UserResourceAssembler;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.exceptions.ForbiddenException;
import com.andrewslater.example.models.AvatarSize;
import com.andrewslater.example.models.User;
import com.andrewslater.example.repositories.UserRepository;
import com.andrewslater.example.security.SecurityUser;
import com.andrewslater.example.services.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping(produces = "application/hal+json")
public class UserAPIController {
    private static final Logger LOG = LoggerFactory.getLogger(UserAPIController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    @Qualifier("userResourceAssembler")
    private UserResourceAssembler userAssembler;

    @RequestMapping(value = Mappings.API_USER_RESOURCE, method = RequestMethod.GET)
    @JsonView(APIView.Authenticated.class)
    public HttpEntity<UserResource> getUser(@PathVariable Long userId) {
        User user = userRepository.findOne(userId);
        return getResponseEntity(user);
    }

    @RequestMapping(value = Mappings.API_USER_RESOURCE, method = RequestMethod.PATCH)
    @JsonView(APIView.Owner.class)
    public HttpEntity<UserResource> patchUser(@PathVariable Long userId,
                                              @RequestBody User user,
                                              @AuthenticationPrincipal SecurityUser securityUser) {
        if (!securityUser.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }
        user.setUserId(userId);
        return getResponseEntity(userService.patchUser(user));
    }

    @RequestMapping(value = Mappings.API_PRINCIPAL_RESOURCE, method = RequestMethod.GET)
    @JsonView(APIView.Owner.class)
    public HttpEntity<UserResource> getPrincipal(@AuthenticationPrincipal SecurityUser securityUser) {
        return getResponseEntity(userRepository.findOne(securityUser.getUser().getUserId()));
    }

    @RequestMapping(value = Mappings.API_USER_AVATAR, method = RequestMethod.POST)
    @JsonView(APIView.Owner.class)
    public HttpEntity<UserResource> uploadAvatar(@PathVariable Long userId,
        @AuthenticationPrincipal SecurityUser securityUser,
        @RequestBody BufferedImage image) throws IOException {
        User principal = securityUser.getUser();

        if (!principal.getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        return getResponseEntity(userService.updateUserAvatar(userId, image));
    }

    @RequestMapping(value = Mappings.API_AVATAR_SIZES, method = RequestMethod.GET)
    public List<AvatarSize> getSizes() {
        return Arrays.asList(AvatarSize.values());
    }

    private ResponseEntity<UserResource> getResponseEntity(User user) {
        return new ResponseEntity<>(userAssembler.toResource(user), HttpStatus.OK);
    }

}
