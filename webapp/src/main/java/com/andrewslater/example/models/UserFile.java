package com.andrewslater.example.models;

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

@Entity
@Table(name = "user_files")
public class UserFile {
    private static final Logger LOG = LoggerFactory.getLogger(UserFile.class);

    public enum Status {UPLOADING, AVAILABLE, SOFT_DELETED, HARD_DELETED}

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false, updatable = false)
    private User user;

    @Column(name = "path")
    private String path;

    @Column(name = "size_in_bytes")
    private Long sizeInBytes;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
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
}
