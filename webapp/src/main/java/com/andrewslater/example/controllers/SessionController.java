package com.andrewslater.example.controllers;

import com.andrewslater.example.forms.RegistrationForm;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.models.User;
import com.andrewslater.example.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;

@Controller
public class SessionController {

    private static final Logger LOG = LoggerFactory.getLogger(SessionController.class);

    @Autowired
    private SystemSettings systemSettings;

    @Autowired
    private UserService userService;

    @Autowired
    private Validator registrationFormValidator;

    @InitBinder("registrationForm")
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(registrationFormValidator);
    }

    @RequestMapping("/login")
    public String login() {
        return "login";
    }

    @RequestMapping("/login-error")
    public String loginError(Model model) {
        model.addAttribute("loginError", true);
        return "login";
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register(Model model) {
        if (!systemSettings.isAllowRegistration()) {
            return "registration_disallowed";
        }

        model.addAttribute("registrationForm", new RegistrationForm());
        return "register";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String handleRegistration(@ModelAttribute @Valid RegistrationForm registrationForm,
                                     BindingResult bindingResult,
                                     Model model) {

        if (!systemSettings.isAllowRegistration()) {
            return "registration_disallowed";
        }

        if (bindingResult.hasErrors()) {
            return "register";
        }


        User user = userService.create(registrationForm);

        model.addAttribute(user);
        if (user.requiresAccountConfirmation()) {
            return "redirect:/unconfirmed";
        }

        return "redirect:/login?registration_successful";
    }

    @RequestMapping(value = "/unconfirmed", method = RequestMethod.GET)
    public String unconfirmed(@RequestParam(required = false) String email,
                            Model model) {

        return "unconfirmed_user";
    }

    @RequestMapping(value = "/confirm", method = RequestMethod.GET)
    public String confirm(@RequestParam String token) {
        LOG.debug("Attempting to confirm user with token {}", token);
        User user = userService.confirmUser(token);

        if (user != null) {
            SecurityContextHolder.clearContext();
            return "redirect:/dashboard";
        }

        return "invalid_confirmation_token";
    }
}
