package com.andrewslater.example.models;

import com.andrewslater.example.api.APIView;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_files")
public class UserFile {
    private static final Logger LOG = LoggerFactory.getLogger(UserFile.class);

    public enum Status {UPLOADING, AVAILABLE, SOFT_DELETED, HARD_DELETED;}

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false, updatable = false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "volume_id", nullable = false)
    @JsonIgnore
    private Volume volume;

    @JsonIgnore
    @Column(name = "path")
    private String path;

    @Column(name = "size_in_bytes", nullable = false)
    private Long sizeInBytes;

    @Column(name = "mimetype", nullable = false)
    private String mimeType;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "updated_at", nullable = false, insertable = false, updatable = true)
    private LocalDateTime updatedAt;

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getSizeInBytes() {
        return sizeInBytes;
    }

    public void setSizeInBytes(Long sizeInBytes) {
        this.sizeInBytes = sizeInBytes;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUrl() {
        return getPath();
    }

    public boolean equals(Object obj) {
        if (obj == null) { return false; }
        if (obj == this) { return true; }
        if (obj.getClass() != getClass()) {
            return false;
        }
        UserFile rhs = (UserFile) obj;
        return new EqualsBuilder()
            .appendSuper(super.equals(obj))
            .append(fileId, rhs.fileId)
            .append(user, rhs.user)
            .append(volume, rhs.volume)
            .append(sizeInBytes, rhs.sizeInBytes)
            .append(mimeType, rhs.mimeType)
            .append(status, rhs.status)
            .append(createdAt, rhs.createdAt)
            .append(updatedAt, rhs.updatedAt)
            .isEquals();
    }

    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(fileId)
            .append(user)
            .append(volume)
            .append(sizeInBytes)
            .append(mimeType)
            .append(status)
            .append(createdAt)
            .append(updatedAt)
            .toHashCode();
    }
}
