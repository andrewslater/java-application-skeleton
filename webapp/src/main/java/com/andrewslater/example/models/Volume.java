package com.andrewslater.example.models;

import com.andrewslater.example.api.APIView;
import com.fasterxml.jackson.annotation.JsonView;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;

@Entity
@Table(name = "volumes")
public class Volume implements Serializable {
    private static final Logger LOG = LoggerFactory.getLogger(Volume.class);

    private static final long serialVersionUID = -886084576240856549L;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer volumeId;

    @Column(name="volume_type", nullable = false)
    @JsonView(APIView.Internal.class)
    @Enumerated(EnumType.STRING)
    private VolumeType type;

    @Column(nullable = false)
    @JsonView(APIView.Internal.class)
    private String name;

    @Column(nullable = false)
    @JsonView(APIView.Internal.class)
    private String path;

    @Column(nullable = false)
    @JsonView(APIView.Internal.class)
    @Enumerated(EnumType.STRING)
    private VolumeStatus status;

    @Column(name = "usage_in_bytes")
    @JsonView(APIView.Internal.class)
    private Long usageInBytes;

    @Transient
    private Long bytesAvailable;

    public Integer getVolumeId() {
        return volumeId;
    }

    public void setVolumeId(Integer volumeId) {
        this.volumeId = volumeId;
    }

    public VolumeType getType() {
        return type;
    }

    public void setType(VolumeType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public VolumeStatus getStatus() {
        return status;
    }

    public void setStatus(VolumeStatus status) {
        this.status = status;
    }

    public String getFullPath(String path) {
        return String.format("%s/%s", StringUtils.stripStart(getPath(), "/"), path);
    }

    public Long getUsageInBytes() {
        return usageInBytes;
    }

    public void setUsageInBytes(Long usageInBytes) {
        this.usageInBytes = usageInBytes;
    }

    public Long getBytesAvailable() {
        return bytesAvailable;
    }

    public void setBytesAvailable(Long bytesAvailable) {
        this.bytesAvailable = bytesAvailable;
    }

    public boolean equals(Object obj) {
        if (obj == null) { return false; }
        if (obj == this) { return true; }
        if (obj.getClass() != getClass()) {
            return false;
        }
        Volume rhs = (Volume) obj;
        return new EqualsBuilder()
            .appendSuper(super.equals(obj))
            .append(volumeId, rhs.volumeId)
            .append(type, rhs.type)
            .append(name, rhs.name)
            .append(path, rhs.path)
            .append(status, rhs.status)
            .append(usageInBytes, rhs.usageInBytes)
            .isEquals();
    }

    public int hashCode() {
        return new HashCodeBuilder(109, 151)
            .append(volumeId)
            .append(type)
            .append(name)
            .append(path)
            .append(status)
            .append(usageInBytes)
            .toHashCode();
    }
}
