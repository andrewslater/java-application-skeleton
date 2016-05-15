package com.andrewslater.example.volumes;

import com.andrewslater.example.models.Volume;
import com.andrewslater.example.models.VolumeType;

import java.awt.image.BufferedImage;
import java.io.InputStream;

public interface VolumeIO {

    VolumeType getSupportedVolumeType();

    /**
     * Saves a BufferedImage to the volume
     * @param volume volume to write the image to
     * @param image image data
     * @param path path to save the file to within the volume
     * @return number of bytes written
     */
    Long saveImageToVolume(Volume volume, BufferedImage image, String path);

    /**
     * Returns an InputStream which lives at the given storagePath
     * @param storagePath path to the resource
     * @return input stream to resource
     */
    InputStream getInputStream(Volume volume, String storagePath);

    /**
     * Returns the amount of space available on the volume. For volumes which are unbounded such as Amazon S3 this
     * function will return null
     * @return number of bytes available or NULL if the volume size is unbounded
     */
    Long getAvailableBytes(Volume volume);
}
