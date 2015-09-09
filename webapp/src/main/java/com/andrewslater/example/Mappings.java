package com.andrewslater.example;

import org.springframework.hateoas.Link;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

public class Mappings {
    // Admin Webapp
    public static final String ADMIN_LIST_USERS = "/admin/users";
    public static final String ADMIN_CREATE_USER = "/admin/user/create";
    public static final String ADMIN_USER_DETAILS = "/admin/user/{userId}";
    public static final String ADMIN_SETTINGS = "/admin/settings";
    public static final String ADMIN_RESET_REACT = "/admin/reset-react";

    // Admin API
    public static final String ADMIN_API_USER_DETAILS = "/api/admin/user/{userId}";
    public static final String ADMIN_API_LIST_USERS = "/api/admin/users";
    public static final String ADMIN_API_SETTINGS = "/api/admin/settings";

    // Authenticated API
    public static final String API_USER_RESOURCE = "/api/user/{userId}";

    public static Link getLink(String path, String ref) {
        return new Link(
            ServletUriComponentsBuilder.fromCurrentContextPath().path(path).toUriString(), ref);
    }
}
