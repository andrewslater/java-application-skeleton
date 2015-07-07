package com.andrewslater.example.forms.settings;

import com.andrewslater.example.models.User;
import com.andrewslater.example.repositories.UserRepository;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class AccountSettingsFormValidator implements Validator {
    private static final Logger LOG = LoggerFactory.getLogger(AccountSettingsFormValidator.class);

    @Autowired
    private UserRepository userRepository;

    @Override public boolean supports(Class<?> clazz) {
        return AccountSettingsForm.class.equals(clazz);
    }

    @Override public void validate(Object target, Errors errors) {
        // TODO: This logic is nearly identical to RegistrationFormValidator
        AccountSettingsForm form = (AccountSettingsForm)target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "fullName", "error.full-name-required");

        if (StringUtils.isEmpty(form.getEmail())) {
            errors.rejectValue("email", "error.email-required");
        } else {
            User existingUser = userRepository.findByEmailIgnoreCase(form.getEmail());

            if (existingUser != null) {
                errors.rejectValue("email", "error.email-already-used");
            }

            if (!EmailValidator.getInstance().isValid(form.getEmail())) {
                errors.rejectValue("email", "error.email-invalid");
            }
        }
    }
}
