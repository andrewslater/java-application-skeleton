package com.andrewslater.example.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.gson.Gson;
import com.andrewslater.example.api.APIView;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.StringUtils;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User implements Serializable {
    private static final Logger LOG = LoggerFactory.getLogger(User.class);

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long userId;

    @Column(nullable = false)
    @JsonView(APIView.Authenticated.class)
    private String email;

    @Column
    @JsonView(APIView.Internal.class)
    private String emailPendingConfirmation;

    @Column(name = "full_name", nullable = false)
    @JsonView(APIView.Authenticated.class)
    private String fullName;

    @JsonView(APIView.Internal.class)
    @Column(nullable = false)
    private boolean enabled;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @JsonIgnore
    @Column(name = "confirmation_token")
    private String confirmationToken;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    @JsonView(APIView.Internal.class)
    private LocalDateTime createdAt;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "last_login")
    @JsonView(APIView.Internal.class)
    private LocalDateTime lastLogin;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    @JsonView(APIView.Internal.class)
    private Set<Role> roles = new HashSet<>();

    public User() {

    }

    public User(String email, String password, List<GrantedAuthority> authorities) {
        setEmail(email);
        setPassword(password);
    }

    public String toString() {
        return new Gson().toJson(this);
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmationToken() {
        return confirmationToken;
    }

    public void setConfirmationToken(String confirmationToken) {
        this.confirmationToken = confirmationToken;
    }

    public boolean requiresAccountConfirmation() {
        return !StringUtils.isEmpty(confirmationToken) &&
            (StringUtils.isEmpty(emailPendingConfirmation) || email.equals(emailPendingConfirmation));
    }

    public boolean requiresEmailChangeConfirmation() {
        return !StringUtils.isEmpty(emailPendingConfirmation) && !email.equals(emailPendingConfirmation);
    }

    public void setRequiresConfirmation(boolean require) {
        setConfirmationToken(require ? UUID.randomUUID().toString() : null);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmailPendingConfirmation() {
        return emailPendingConfirmation;
    }

    public void setEmailPendingConfirmation(String emailPendingConfirmation) {
        this.emailPendingConfirmation = emailPendingConfirmation;
        if (!StringUtils.isEmpty(emailPendingConfirmation)) {
            setRequiresConfirmation(true);
        }
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public boolean emailChangeIsPending() {
        return !StringUtils.isEmpty(emailPendingConfirmation) && !email.equals(
            emailPendingConfirmation);
    }

    public boolean equals(Object obj) {
        if (obj == null) { return false; }
        if (obj == this) { return true; }
        if (obj.getClass() != getClass()) {
            return false;
        }
        User rhs = (User) obj;
        return new EqualsBuilder()
            .appendSuper(super.equals(obj))
            .append(userId, rhs.userId)
            .append(email, rhs.email)
            .append(emailPendingConfirmation, rhs.emailPendingConfirmation)
            .append(fullName, rhs.fullName)
            .append(enabled, rhs.enabled)
            .append(password, rhs.password)
            .append(confirmationToken, rhs.confirmationToken)
            .append(createdAt, rhs.createdAt)
            .append(lastLogin, rhs.lastLogin)
            .append(roles, rhs.roles)
            .isEquals();
    }


    public int hashCode() {
        return new HashCodeBuilder(17, 37).
            append(userId).
            append(email).
            append(emailPendingConfirmation).
            append(fullName).
            append(enabled).
            append(password).
            append(confirmationToken).
            append(createdAt).
            append(lastLogin).
            append(roles).
            toHashCode();
    }
}
