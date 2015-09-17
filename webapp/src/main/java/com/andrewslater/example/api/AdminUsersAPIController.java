package com.andrewslater.example.api;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.assemblers.AdminUserResourceAssembler;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.models.User;
import com.andrewslater.example.repositories.UserRepository;
import com.fasterxml.jackson.annotation.JsonView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AdminUsersAPIController {

    private static final Logger LOG = LoggerFactory.getLogger(AdminUsersAPIController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Qualifier("adminUserResourceAssembler")
    private AdminUserResourceAssembler userAssembler;

    @RequestMapping(value = "/status", method = RequestMethod.GET)
    public String getStatus() {
        return  "{\"systemStatus\": \"up\"}";
    }

    @RequestMapping(value = Mappings.ADMIN_API_USER_DETAILS, method = RequestMethod.GET)
    @JsonView(APIView.Internal.class)
    public HttpEntity<UserResource> getUser(@PathVariable("userId") Long userId) {
        User user = userRepository.findOne(userId);
        return new ResponseEntity<>(userAssembler.toResource(user), HttpStatus.OK);
    }

    @RequestMapping(value = Mappings.ADMIN_API_LIST_USERS, method = RequestMethod.GET)
    @JsonView(APIView.Internal.class)
    public HttpEntity<Page<UserResource>> getUsers(@RequestParam(value = "page", required = false)
    Integer page,
                                                   @RequestParam(value = "size", required = false)
                                                   Integer size,
                                                   @RequestParam(value = "sort", required = false)
                                                   String sort) {
        PageRequest pageRequest = new PageRequest(page == null ? 0 : page,
                                                  size == null ? 10 : size,
                                                  sort == null ? null : SortQuery.toSort(sort));
        Page<User> usersPage = userRepository.findAll(pageRequest);
        List<UserResource> resources = new ArrayList<>();

        for (User user : usersPage) {
            resources.add(userAssembler.toResource(user));
        }

        Page<UserResource> resourcesPage = new PageImpl<>(resources, pageRequest, usersPage.getTotalElements());
        return new ResponseEntity<>(resourcesPage, HttpStatus.OK);
    }

    @RequestMapping(value = Mappings.ADMIN_API_USER_DETAILS, method = RequestMethod.PUT)
    @JsonView(APIView.Internal.class)
    public HttpEntity<UserResource> updateUser(@PathVariable("userId") Long userId, @RequestBody User proposedUser) {
        User user = userRepository.findOne(userId);
        LOG.debug("Requested update to user: {}", proposedUser);
        return new ResponseEntity<>(userAssembler.toResource(user), HttpStatus.OK);
    }
}
