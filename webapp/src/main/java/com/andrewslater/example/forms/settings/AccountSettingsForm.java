package com.andrewslater.example.forms.settings;

import com.andrewslater.example.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AccountSettingsForm {
    private static final Logger LOG = LoggerFactory.getLogger(AccountSettingsForm.class);

    private String fullName;
    private String email;

    public AccountSettingsForm() {

    }

    public AccountSettingsForm(User user) {
        setFullName(user.getFullName());
        setEmail(user.getEmail());
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
