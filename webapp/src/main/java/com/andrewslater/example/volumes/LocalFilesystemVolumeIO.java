package com.andrewslater.example.volumes;

import com.andrewslater.example.exceptions.NotFoundException;
import com.andrewslater.example.exceptions.VolumeException;
import com.andrewslater.example.models.Volume;
import com.andrewslater.example.models.VolumeType;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

@Component
public class LocalFilesystemVolumeIO implements FileBackedVolumeIO {
    private static final Logger LOG = LoggerFactory.getLogger(LocalFilesystemVolumeIO.class);

    @Override public VolumeType getSupportedVolumeType() {
        return VolumeType.LOCAL_FILESYSTEM;
    }

    @Override public Long saveImageToVolume(Volume volume, BufferedImage image, String path) {

        File file = new File(volume.getPath(), path);
        try {
            ensureDirectoriesExist(file);

            if (!ImageIO.write(image, getImageFormat(FilenameUtils.getExtension(path)), file)) {
                throw new VolumeException("Failed to write image to disk: " + file.getAbsolutePath());
            }
        } catch (IOException ex) {
            throw new VolumeException("Failed to write image to disk: " + ex.getMessage(), ex);
        }

        return file.length();
    }

    @Override public InputStream getInputStream(Volume volume, String storagePath) {
        try {
            return new FileInputStream(getFile(volume, storagePath));
        } catch (FileNotFoundException ex) {
            throw new NotFoundException("Could not find resource on disk: " + storagePath);
        }
    }

    @Override public File getFile(Volume volume, String storagePath) {
        File file = new File(volume.getPath(), storagePath);
        if (!file.exists()) {
            throw new NotFoundException("Could not find resource on disk: " + file.getAbsolutePath());
        }
        return file;
    }

    @Override
    public Long getAvailableBytes(Volume volume) {
        File file = new File(volume.getPath());
        if (!file.exists()) {
            return 0l;
        }
        return file.getUsableSpace();
    }

    private String getImageFormat(String extension) {
        if (extension == null || !Arrays.asList(ImageIO.getWriterFormatNames()).contains(extension)) {
            throw new VolumeException("Invalid file extension for image: " + extension);
        }

        return extension;
    }

    private void ensureDirectoriesExist(File file) throws IOException {
        File parent = file.getParentFile();
        if (!parent.mkdirs()) {
            throw new IOException("Unable to create directory: " + parent.getAbsolutePath());
        }
    }
}
