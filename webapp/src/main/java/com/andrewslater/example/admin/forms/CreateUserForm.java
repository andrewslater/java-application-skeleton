package com.andrewslater.example.admin.forms;

import com.andrewslater.example.models.Role;

public class CreateUserForm {
    private String email = "";
    private String fullName = "";
    private String password = "";
    private Boolean enabled = true;
    private Boolean requireConfirmation = false;
    private Role role = Role.USER;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getRequireConfirmation() {
        return requireConfirmation;
    }

    public void setRequireConfirmation(Boolean requireConfirmation) {
        this.requireConfirmation = requireConfirmation;
    }
}
