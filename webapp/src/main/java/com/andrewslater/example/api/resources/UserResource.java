package com.andrewslater.example.api.resources;

import com.andrewslater.example.models.User;
import org.springframework.hateoas.Resource;

public class UserResource extends Resource<User> {
    public UserResource(User content) {
        super(content);
    }
}
