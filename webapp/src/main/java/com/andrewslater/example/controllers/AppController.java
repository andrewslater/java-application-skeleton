package com.andrewslater.example.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = {"/", "/profile", "/preferences", "/admin/**", "/dashboard"})
public class AppController {

    @RequestMapping(method = RequestMethod.GET)
    public String view() {
        return "fragments/react";
    }
}
