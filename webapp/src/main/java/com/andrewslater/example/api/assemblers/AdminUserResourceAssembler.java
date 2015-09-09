package com.andrewslater.example.api.assemblers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.admin.api.UsersAdminAPIController;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.models.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@Component
@Qualifier("adminUserResourceAssembler")
public class AdminUserResourceAssembler extends UserResourceAssembler {

    @Override
    public UserResource toResource(User user) {
        UserResource resource = super.toResource(user);
        resource.add(linkTo(methodOn(UsersAdminAPIController.class).getUser(user.getUserId())).withRel("admin-self"));
        resource.add(Mappings.getLink("/admin/users/" + user.getUserId(), "web-admin-self"));
        return resource;
    }
}
