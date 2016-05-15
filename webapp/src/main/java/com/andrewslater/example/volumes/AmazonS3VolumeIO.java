package com.andrewslater.example.volumes;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.Upload;
import com.andrewslater.example.exceptions.VolumeException;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.models.Volume;
import com.andrewslater.example.models.VolumeType;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Arrays;
import java.util.Date;

@Component
public class AmazonS3VolumeIO implements UrlBackedVolumeIO {

    private static final Logger LOG = LoggerFactory.getLogger(AmazonS3VolumeIO.class);

    @Autowired
    private SystemSettings systemSettings;

    @Override public VolumeType getSupportedVolumeType() {
        return VolumeType.AMAZON_S3;
    }

    @Override public Long saveImageToVolume(Volume volume, BufferedImage image, String path) {
        try {
            TransferManager tx = new TransferManager(systemSettings.getAWSCredentials());
            String fullPath = volume.getFullPath(path);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, getImageFormat(FilenameUtils.getExtension(path)), outputStream);
            byte[] buffer = outputStream.toByteArray();
            InputStream is = new ByteArrayInputStream(buffer);
            ObjectMetadata meta = new ObjectMetadata();
            meta.setContentLength(buffer.length);

            Upload upload = tx.upload(volume.getName(), fullPath, is, meta);
            upload.waitForCompletion();
        } catch ( IOException | InterruptedException ex) {
            LOG.error("Could not upload to s3: " + ex.getMessage(), ex);
        }

        return 0l;
    }

    @Override public InputStream getInputStream(Volume volume, String storagePath) {
        return getS3Client().getObject(volume.getName(), volume.getFullPath(storagePath)).getObjectContent();
    }

    @Override
    public Long getAvailableBytes(Volume volume) {
        return null;
    }

    @Override public URL getURL(Volume volume, String path) {
        return getURL(volume, path, null);
    }

    @Override public URL getURL(Volume volume, String path, Integer secondsValid) {
        AmazonS3 s3Client = getS3Client();
        Date expiration = null;

        if (secondsValid != null) {
            expiration = new java.util.Date();
            long msec = expiration.getTime();
            msec += 1000 * secondsValid;
            expiration.setTime(msec);
        }

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(volume.getName(), volume.getFullPath(path));
        generatePresignedUrlRequest.setMethod(HttpMethod.GET); // Default.
        generatePresignedUrlRequest.setExpiration(expiration);

        return s3Client.generatePresignedUrl(generatePresignedUrlRequest);
    }

    private AmazonS3 getS3Client() {
        return new AmazonS3Client(systemSettings.getAWSCredentials());
    }

    // TODO: DRY this up (also implemented in LocalFilesystemVolumeIO)
    private String getImageFormat(String extension) {
        if (extension == null || !Arrays.asList(ImageIO.getWriterFormatNames()).contains(extension)) {
            throw new VolumeException("Invalid file extension for image: " + extension);
        }

        return extension;
    }


}
