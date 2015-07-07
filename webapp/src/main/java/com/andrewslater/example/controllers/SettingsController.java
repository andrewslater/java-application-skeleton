package com.andrewslater.example.controllers;

import com.andrewslater.example.forms.settings.AccountSettingsForm;
import com.andrewslater.example.services.UserService;
import com.andrewslater.example.security.SecurityUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;

@Controller
@RequestMapping("settings")
public class SettingsController {
    private static final Logger LOG = LoggerFactory.getLogger(SettingsController.class);

    @Autowired
    private UserService userService;

    @RequestMapping(value = "account", method = RequestMethod.GET)
    public String editProfile(Model model, @AuthenticationPrincipal SecurityUser securityUser) {
        model.addAttribute("accountSettingsForm", new AccountSettingsForm(securityUser.getUser()));
        return "settings/account";
    }

    @RequestMapping(value = "/account", method = RequestMethod.POST)
    public String saveProfile(@Valid @ModelAttribute AccountSettingsForm form,
                            @AuthenticationPrincipal SecurityUser securityUser,
                            BindingResult bindingResult,
                            Model model) {

        model.addAttribute("accountSettingsForm", form);

        if (bindingResult.hasErrors()) {
            return "settings/account";
        }

        securityUser.getUser();
        userService.updateUser(securityUser.getUser(), form);
        model.addAttribute("saved", true);
        return "settings/account";
    }
}
