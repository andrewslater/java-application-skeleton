package com.andrewslater.example.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UsersController {
    private static final Logger LOG = LoggerFactory.getLogger(UsersController.class);

    @RequestMapping("/confirmation")
    public String confirmationRequired() {
        return "unconfirmed_user";
    }
}
