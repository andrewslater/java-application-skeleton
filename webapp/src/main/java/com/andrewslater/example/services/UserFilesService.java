package com.andrewslater.example.services;

import com.andrewslater.example.exceptions.VolumeException;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.models.User;
import com.andrewslater.example.models.UserFile;
import com.andrewslater.example.models.VolumeType;
import com.andrewslater.example.repositories.UserFilesRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.net.URL;
import java.time.LocalDateTime;

@Service
public class UserFilesService {
    private static final Logger LOG = LoggerFactory.getLogger(UserFilesService.class);

    @Autowired
    private UserFilesRepository repository;

    @Autowired
    private SystemSettingsService systemSettingsService;

    @Autowired
    private VolumeService volumeService;

    @Value("${user-files.random-directory-depth}")
    private Integer randomDirectoryDepth;

    public UserFile createPublicUserFile(User user, String filename, BufferedImage image) {
        return createUserFile(user, filename, image, true);
    }

    public UserFile createUserFile(User user, String filename, BufferedImage image) {
        return createUserFile(user, filename, image, false);
    }

    public UserFile createUserFile(User user, String filename, BufferedImage image, boolean isPublic) {
        UserFile userFile = createUserFile(user, filename, isPublic);
        String mimeType = "image/png";

        try {
            Long bytesWritten = volumeService.saveImageToVolume(userFile.getVolume(), image, userFile.getStoragePath());
            userFile.setMimeType(mimeType);
            userFile.setSizeInBytes(bytesWritten);
            userFile.setStatus(UserFile.Status.AVAILABLE);
        } catch (VolumeException ex) {
            repository.delete(userFile);
        }

        return repository.save(userFile);
    }

    public File getFile(UserFile userFile) {

        if (!userFile.getVolume().getType().equals(VolumeType.LOCAL_FILESYSTEM)) {
            throw new RuntimeException("UserFile is not stored on a volume of type LOCAL_FILESYSTEM");
        }

        String extension = "";

        try {
            extension = MimeTypes.getDefaultMimeTypes().forName(userFile.getMimeType()).getExtension();
        } catch (MimeTypeException ex) {
            LOG.error("Unable to determine mime type for UserFile");
        }

        File destDir = new File(userFile.getVolume().getPath(), userFile.getPath());
        String filename = String.format("%d%s", userFile.getFileId(), extension);
        return new File(destDir, filename);
    }

    private UserFile createUserFile(User user, String filename, boolean isPublic) {
        SystemSettings systemSettings = systemSettingsService.getSystemSettings();

        if (systemSettings.getActiveVolume() == null) {
            throw new VolumeException("No active volume available");
        }

        UserFile userFile = new UserFile();
        LocalDateTime creationDate = LocalDateTime.now();

        userFile.setPath(generateRandomPath());
        userFile.setName(filename);
        userFile.setCreatedAt(creationDate);
        userFile.setUpdatedAt(creationDate);
        userFile.setVolume(systemSettings.getActiveVolume());
        userFile.setStatus(UserFile.Status.SAVING);
        userFile.setSizeInBytes(0l);
        userFile.setUser(user);
        userFile.setIsPublic(isPublic);

        return repository.save(userFile);
    }

    public URL getURL(UserFile userFile) {
        return volumeService.getURL(userFile.getVolume(), userFile.getStoragePath());
    }

    private String generateRandomPath() {
        String subdir = "";

        for (int i = 0; i < randomDirectoryDepth; i++) {
            subdir += RandomStringUtils.randomAlphanumeric(2).toLowerCase() + "/";
        }
        subdir = StringUtils.trimTrailingCharacter(subdir, '/');
        return subdir;
    }
}
