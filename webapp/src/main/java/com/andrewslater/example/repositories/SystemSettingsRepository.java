package com.andrewslater.example.repositories;

import com.andrewslater.example.models.SystemSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

@Repository
public class SystemSettingsRepository {

    private static final Logger LOG = LoggerFactory.getLogger(SystemSettingsRepository.class);

    @Autowired
    private EntityManager entityManager;

    public SystemSettings getSystemSettings() {
        return entityManager.find(SystemSettings.class, 1);
    }

    @Transactional
    public SystemSettings saveSystemSettings(SystemSettings systemSettings) {
        entityManager.merge(systemSettings);
        entityManager.flush();
        return systemSettings;
    }
}
