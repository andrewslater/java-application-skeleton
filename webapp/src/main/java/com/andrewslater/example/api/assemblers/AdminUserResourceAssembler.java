package com.andrewslater.example.api.assemblers;

import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.models.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("adminUserResourceAssembler")
public class AdminUserResourceAssembler extends UserResourceAssembler {

    @Override
    public UserResource toResource(User user) {
        UserResource resource = super.toResource(user);
        return resource;
    }
}
