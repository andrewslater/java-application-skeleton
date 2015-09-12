package com.andrewslater.example.api.assemblers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.UserAPIController;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.models.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@Component
@Qualifier("userResourceAssembler")
public class UserResourceAssembler implements ResourceAssembler<User, UserResource> {

    @Override
    public UserResource toResource(User user) {
        UserResource resource = new UserResource(user);
        resource.add(Mappings.getLink(Mappings.composePath(Mappings.API_USER_RESOURCE, user.getUserId()), "self"));
        return resource;
    }
}
