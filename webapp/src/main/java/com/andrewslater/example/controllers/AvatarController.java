package com.andrewslater.example.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.models.UserFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class AvatarController {
    private static final Logger LOG = LoggerFactory.getLogger(AvatarController.class);

    @RequestMapping(value = Mappings.API_PRINCIPAL_AVATAR, method = RequestMethod.POST)
    @ResponseBody
    public UserFile uploadProfileAvatar(@RequestParam("file") MultipartFile file) {
        LOG.debug("Hnadling principal avatar upload: {}", file);
        return new UserFile();
    }
}
