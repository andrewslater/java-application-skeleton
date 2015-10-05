package com.andrewslater.example.models;

import com.andrewslater.example.api.APIView;
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
import javax.persistence.Table;

@Entity
@Table(name = "volumes")
public class Volume {
    private static final Logger LOG = LoggerFactory.getLogger(Volume.class);

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
            .isEquals();
    }

    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(volumeId)
            .append(type)
            .append(name)
            .append(path)
            .append(status)
            .toHashCode();
    }
}
