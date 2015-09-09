package com.andrewslater.example;

import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.security.SecurityUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class ExampleControllerAdvice {
    private static final Logger LOG = LoggerFactory.getLogger(ExampleControllerAdvice.class);

    @Autowired
    private SystemSettings systemSettings;

    @Value("${webpack.mode}")
    private String webpackMode;

    @ModelAttribute
    public void addAttributes(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof SecurityUser) {
            model.addAttribute("principal", ((SecurityUser)auth.getPrincipal()).getUser());
        }

        model.addAttribute("systemSettings", systemSettings);
        model.addAttribute("MAPPINGS", new Mappings());
        model.addAttribute("webpackMode", webpackMode);
    }
}
