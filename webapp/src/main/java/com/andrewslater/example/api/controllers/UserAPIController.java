package com.andrewslater.example.api.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.APIView;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.exceptions.ForbiddenException;
import com.andrewslater.example.models.User;
import com.andrewslater.example.repositories.UserRepository;
import com.andrewslater.example.security.SecurityUser;
import com.andrewslater.example.services.UserService;
import com.fasterxml.jackson.annotation.JsonView;
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

@RestController
@RequestMapping(produces = "application/hal+json")
public class UserAPIController {
    private static final Logger LOG = LoggerFactory.getLogger(UserAPIController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @RequestMapping(value = Mappings.API_USER_RESOURCE, method = RequestMethod.GET)
    @JsonView(APIView.Authenticated.class)
    public HttpEntity<UserResource> getUser(@PathVariable Long userId) {
        User user = userRepository.findOne(userId);
        return userService.getResponseEntity(user);
    }

    @RequestMapping(value = Mappings.API_USER_RESOURCE, method = RequestMethod.PATCH)
    @JsonView(APIView.Authenticated.class)
    public HttpEntity<UserResource> patchUser(@PathVariable Long userId,
                                              @RequestBody User user,
                                              @AuthenticationPrincipal SecurityUser securityUser) {
        if (!securityUser.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }
        user.setUserId(userId);
        return userService.patchUser(user);
    }

    @RequestMapping(value = Mappings.API_PRINCIPAL_RESOURCE, method = RequestMethod.GET)
    @JsonView(APIView.Owner.class)
    public HttpEntity<UserResource> getPrincipal(@AuthenticationPrincipal SecurityUser securityUser) {
        return userService.getResponseEntity(userRepository.findOne(securityUser.getUser().getUserId()));
    }
}
