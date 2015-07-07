package com.andrewslater.example.models;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Table(name = "system_settings")
public class SystemSettings {
    private static final Logger LOG = LoggerFactory.getLogger(SystemSettings.class);

    @Id
    private Long id = 1l;

    @Column(name = "allow_registration", nullable = false)
    private boolean allowRegistration;

    @Column(name = "require_email_confirmation", nullable = false)
    private boolean requireEmailConfirmation;

    @Column(name = "restrict_registration_domains", nullable = false)
    private boolean restrictRegistrationDomains;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "system_settings_allowed_domains", joinColumns = @JoinColumn(name = "settings_id"))
    @Column(name = "domain", nullable = false)
    private Set<String> allowedDomains;

    public boolean isAllowRegistration() {
        return allowRegistration;
    }

    public void setAllowRegistration(boolean allowRegistration) {
        this.allowRegistration = allowRegistration;
    }

    public Set<String> getAllowedDomains() {
        return allowedDomains;
    }

    public void setAllowedDomains(Set<String> allowedDomains) {
        this.allowedDomains = allowedDomains;
    }

    public boolean isRestrictRegistrationDomains() {
        return restrictRegistrationDomains;
    }

    public void setRestrictRegistrationDomains(boolean restrictRegistrationDomains) {
        this.restrictRegistrationDomains = restrictRegistrationDomains;
    }

    public boolean isRequireEmailConfirmation() {
        return requireEmailConfirmation;
    }

    public void setRequireEmailConfirmation(boolean requireEmailConfirmation) {
        this.requireEmailConfirmation = requireEmailConfirmation;
    }
}
