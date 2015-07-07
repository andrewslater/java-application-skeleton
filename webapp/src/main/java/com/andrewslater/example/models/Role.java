package com.andrewslater.example.models;


public enum Role {
    USER, ADMIN;

    public String getRoleName() {
        return "ROLE_" + toString();
    }
}
