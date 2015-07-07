package com.andrewslater.example.admin.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.repositories.SystemSettingsRepository;
import com.andrewslater.example.models.SystemSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;

@Controller
@RequestMapping(Mappings.ADMIN_SETTINGS)
public class SettingsAdminController {

    private static final Logger LOG = LoggerFactory.getLogger(SettingsAdminController.class);

    @Autowired
    private SystemSettingsRepository settingsRepository;

    @RequestMapping(method = RequestMethod.GET)
    public String editSystemSettings(Model model) {
        model.addAttribute("settings", settingsRepository.getSystemSettings());
        return "admin/edit_system_settings";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String updateSystemSettings(@Valid @ModelAttribute("settings") SystemSettings settings,
                                       BindingResult bindingResult,
                                       Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("settings", settings);
            return "admin/edit_system_settings";
        }

        settingsRepository.updateSystemSettings(settings);
        return "redirect:/admin/settings?success";
    }

}
