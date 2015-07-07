package com.andrewslater.example.forms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RegistrationForm {
    private static final Logger LOG = LoggerFactory.getLogger(RegistrationForm.class);

    private String fullName;
    private String email;
    private String password;

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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
