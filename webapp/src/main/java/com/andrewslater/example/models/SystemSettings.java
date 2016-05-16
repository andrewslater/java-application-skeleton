package com.andrewslater.example.models;

import com.amazonaws.auth.AWSCredentials;
import com.andrewslater.example.annotations.Patchable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "system_settings")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SystemSettings implements Serializable {

    private static final Logger LOG = LoggerFactory.getLogger(SystemSettings.class);

    @Id
    private Integer id = 1;

    @Column(name = "allow_registration", nullable = false)
    @Patchable
    private Boolean allowRegistration;

    @Column(name = "require_email_confirmation", nullable = false)
    @Patchable
    private Boolean requireEmailConfirmation;

    @Column(name = "restrict_registration_domains", nullable = false)
    @Patchable
    private Boolean restrictRegistrationDomains;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "system_settings_allowed_domains", joinColumns = @JoinColumn(name = "settings_id"))
    @Column(name = "domain", nullable = false)
    @Patchable
    private Set<String> allowedDomains;

    @OneToOne
    @JoinColumn(name = "active_volume_id")
    @Patchable
    private Volume activeVolume;

    @Column(name = "aws_access_key")
    @Patchable
    private String awsAccessKey;

    @Column(name = "aws_secret_access_key")
    @Patchable
    private String awsSecretAccessKey;

    public Integer getId() {
        return id;
    }

    public Boolean getAllowRegistration() {
        return allowRegistration;
    }

    public void setAllowRegistration(Boolean allowRegistration) {
        this.allowRegistration = allowRegistration;
    }

    public Set<String> getAllowedDomains() {
        return allowedDomains;
    }

    public void setAllowedDomains(Set<String> allowedDomains) {
        this.allowedDomains = allowedDomains;
    }

    public Boolean getRestrictRegistrationDomains() {
        return restrictRegistrationDomains;
    }

    public void setRestrictRegistrationDomains(Boolean restrictRegistrationDomains) {
        this.restrictRegistrationDomains = restrictRegistrationDomains;
    }

    public Boolean getRequireEmailConfirmation() {
        return requireEmailConfirmation;
    }

    public void setRequireEmailConfirmation(Boolean requireEmailConfirmation) {
        this.requireEmailConfirmation = requireEmailConfirmation;
    }

    public Volume getActiveVolume() {
        return activeVolume;
    }

    public void setActiveVolume(Volume activeVolume) {
        this.activeVolume = activeVolume;
    }

    public String getAwsAccessKey() {
        return awsAccessKey;
    }

    public void setAwsAccessKey(String awsAccessKey) {
        this.awsAccessKey = awsAccessKey;
    }

    public String getAwsSecretAccessKey() {
        return awsSecretAccessKey;
    }

    public void setAwsSecretAccessKey(String awsSecretAccessKey) {
        this.awsSecretAccessKey = awsSecretAccessKey;
    }

    @JsonIgnore
    public AWSCredentials getAWSCredentials() {
        return new AWSCredentials() {
            @Override public String getAWSAccessKeyId() {
                return awsAccessKey;
            }

            @Override public String getAWSSecretKey() {
                return awsSecretAccessKey;
            }
        };
    }

    public boolean equals(Object obj) {
        if (obj == null) { return false; }
        if (obj == this) { return true; }
        if (obj.getClass() != getClass()) {
            return false;
        }
        SystemSettings rhs = (SystemSettings) obj;
        return new EqualsBuilder()
            .appendSuper(super.equals(obj))
            .append(id, rhs.id)
            .append(allowRegistration, rhs.allowRegistration)
            .append(requireEmailConfirmation, rhs.requireEmailConfirmation)
            .append(restrictRegistrationDomains, rhs.restrictRegistrationDomains)
            .append(allowedDomains, rhs.allowedDomains)
            .append(activeVolume, rhs.activeVolume)
            .append(awsAccessKey, rhs.awsAccessKey)
            .append(awsSecretAccessKey, rhs.awsSecretAccessKey)
            .isEquals();
    }

    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(id)
            .append(allowRegistration)
            .append(requireEmailConfirmation)
            .append(restrictRegistrationDomains)
            .append(allowedDomains)
            .append(activeVolume)
            .append(awsAccessKey)
            .append(awsSecretAccessKey)
            .toHashCode();
    }
}
