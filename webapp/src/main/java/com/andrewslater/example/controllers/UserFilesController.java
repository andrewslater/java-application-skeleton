package com.andrewslater.example.controllers;

import com.andrewslater.example.models.UserFile;
import com.andrewslater.example.repositories.UserFilesRepository;
import com.andrewslater.example.services.UserFilesService;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.io.IOException;

@Controller
public class UserFilesController {
    private static final Logger LOG = LoggerFactory.getLogger(UserFilesController.class);

    @Autowired
    private UserFilesRepository repository;

    @Autowired
    private UserFilesService service;

    @RequestMapping(value = "/user-file/{id}")
    @ResponseBody
    public void getFile(@PathVariable Long id,
                        HttpServletRequest request,
                        HttpServletResponse response) throws IOException {
        try {
            UserFile userFile = repository.findOne(id);
            response.setContentType(userFile.getMimeType());
            response.setHeader("Cache-Control", "private, max-age=86400");
            IOUtils.copy(new FileInputStream(service.getFile(userFile)), response.getOutputStream());
            response.flushBuffer();
        } catch (Exception ex) {
            LOG.debug("Exception reading UserFile: {}", ex.getMessage(), ex);
            throw ex;
        }
    }
}
