package com.andrewslater.example.services;

import com.andrewslater.example.api.ModelPatcher;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.repositories.SystemSettingsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SystemSettingsService {
    private static final Logger LOG = LoggerFactory.getLogger(SystemSettingsService.class);

    @Autowired
    private ModelPatcher modelPatcher;

    @Autowired
    private SystemSettingsRepository repository;

    public SystemSettings patchSystemSettings(SystemSettings settings) {

        SystemSettings existingSettings = getSystemSettings();

        if (existingSettings == null) {
            throw new RuntimeException("Unable to find existing system settings to patch");
        }

        modelPatcher.patchModel(existingSettings, settings);
        return repository.saveSystemSettings(existingSettings);
    }

    public SystemSettings getSystemSettings() {
        return repository.getSystemSettings();
    }
}
