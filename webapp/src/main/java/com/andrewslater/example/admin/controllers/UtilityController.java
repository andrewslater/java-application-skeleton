package com.andrewslater.example.admin.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.react.ReactEngine;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UtilityController {
    private static final Logger LOG = LoggerFactory.getLogger(UtilityController.class);

    @Autowired
    private GenericObjectPool<ReactEngine> reactEnginePool;

    @RequestMapping(Mappings.ADMIN_RESET_REACT)
    @ResponseBody
    public String resetReact() {
        reactEnginePool.clear();
        return "{\"status\": \"reset\"}";
    }
}
