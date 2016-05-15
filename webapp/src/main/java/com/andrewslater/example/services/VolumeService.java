package com.andrewslater.example.services;

import com.andrewslater.example.exceptions.VolumeException;
import com.andrewslater.example.models.Volume;
import com.andrewslater.example.models.VolumeType;
import com.andrewslater.example.repositories.VolumeRepository;
import com.andrewslater.example.volumes.AmazonS3VolumeIO;
import com.andrewslater.example.volumes.FileBackedVolumeIO;
import com.andrewslater.example.volumes.LocalFilesystemVolumeIO;
import com.andrewslater.example.volumes.UrlBackedVolumeIO;
import com.andrewslater.example.volumes.VolumeIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;

@Service
public class VolumeService {
    private static final Logger LOG = LoggerFactory.getLogger(VolumeService.class);

    private Set<VolumeIO> volumeIOs = new HashSet<>();

    @Autowired
    private VolumeRepository repository;

    @Autowired
    public VolumeService(LocalFilesystemVolumeIO localFilesystemVolumeIO,
        AmazonS3VolumeIO amazonS3VolumeIO) {
        volumeIOs.add(localFilesystemVolumeIO);
        volumeIOs.add(amazonS3VolumeIO);
    }

    public Page<Volume> findVolumes(PageRequest pageRequest, String filter) {
        Page<Volume> volumesPage = null;

        if (!StringUtils.isEmpty(filter)) {
            volumesPage = repository.findByNameContainingOrPathContainingAllIgnoreCase(filter, filter, pageRequest);
        } else {
            volumesPage = repository.findAll(pageRequest);
        }

        for (Volume volume : volumesPage) {
            if (volume.getType().equals(VolumeType.LOCAL_FILESYSTEM)) {
                volume.setBytesAvailable(getVolumeIO(volume).getAvailableBytes(volume));
            }
        }

        return volumesPage;
    }

    public Long saveImageToVolume(Volume volume, BufferedImage image, String path) {
        long bytesWritten = getVolumeIO(volume).saveImageToVolume(volume, image, path);
        repository.updateVolumeUsage(bytesWritten, volume.getVolumeId());
        return bytesWritten;
    }

    private VolumeIO getVolumeIO(Volume volume) {
        for (VolumeIO volumeIO : volumeIOs) {
            if (volumeIO.getSupportedVolumeType().equals(volume.getType())) {
                return volumeIO;
            }
        }

        throw new VolumeException("No VolumeIO implementation was found which supports volume type " + volume.getType());
    }

    public InputStream getInputStream(Volume volume, String storagePath) {
        return getVolumeIO(volume).getInputStream(volume, storagePath);
    }

    public URL getURL(Volume volume, String storagePath) {
        return getURL(volume, storagePath, null);
    }

    public URL getURL(Volume volume, String storagePath, Integer secondsValid) {
        VolumeIO volumeIO = getVolumeIO(volume);

        if (volumeIO instanceof UrlBackedVolumeIO) {
            return ((UrlBackedVolumeIO)volumeIO).getURL(volume, storagePath, secondsValid);
        }

        return null;
    }

    public boolean isURLAvailable(Volume volume, String storagePath) {
        VolumeIO volumeIO = getVolumeIO(volume);
        return (volumeIO != null && volumeIO instanceof UrlBackedVolumeIO);
    }

    public boolean isFileAvailable(Volume volume, String storagePath) {
        VolumeIO volumeIO = getVolumeIO(volume);
        return (volumeIO != null && volumeIO instanceof FileBackedVolumeIO);
    }
}
