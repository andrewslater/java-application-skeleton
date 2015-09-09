package com.andrewslater.example.admin.api;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.api.APIView;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.repositories.SystemSettingsRepository;
import com.fasterxml.jackson.annotation.JsonView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminSettingsAPIController {
    private static final Logger LOG = LoggerFactory.getLogger(AdminSettingsAPIController.class);

    @Autowired
    private SystemSettingsRepository repository;

    @RequestMapping(value = Mappings.ADMIN_API_SETTINGS, method = RequestMethod.GET)
    @JsonView(APIView.Internal.class)
    public HttpEntity<SystemSettings> getSettings() {
        return new ResponseEntity<>(repository.getSystemSettings(), HttpStatus.OK);
    }

    @RequestMapping(value = Mappings.ADMIN_API_SETTINGS, method = RequestMethod.PATCH)
    @JsonView(APIView.Internal.class)
    public HttpEntity<SystemSettings> saveSettings(@RequestBody SystemSettings settings) {
        SystemSettings savedSettings = repository.updateSystemSettings(settings);
        return new ResponseEntity<>(savedSettings, HttpStatus.OK);
    }
}
