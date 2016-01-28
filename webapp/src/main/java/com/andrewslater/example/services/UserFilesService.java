package com.andrewslater.example.services;

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
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class UserFilesService {
    private static final Logger LOG = LoggerFactory.getLogger(UserFilesService.class);

    @Autowired
    private UserFilesRepository repository;

    @Autowired
    private SystemSettings systemSettings;

    public UserFile createUserFile(User user, String filename, BufferedImage image) {
        UserFile userFile = createUserFile(user, filename);

        userFile.setMimeType("image/png");
        File file = getFile(userFile);

        try {
            ensureDirectoriesExist(file);

            if (!ImageIO.write(image, getImageFormat(userFile.getMimeType()), file)) {
                repository.delete(userFile);
                throw new RuntimeException("Failed to write image to disk: " + file.getAbsolutePath());
            }
        } catch (IOException ex) {
            repository.delete(userFile);
            throw new RuntimeException("Failed to write UserFile to disk: " + ex.getMessage(), ex);
        }

        userFile.setSizeInBytes(file.length());
        userFile.setStatus(UserFile.Status.AVAILABLE);

        return repository.save(userFile);
    }

    private String getImageFormat(String mimeType) {
        return mimeType.replace("image/", "");
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

    private void ensureDirectoriesExist(File file) throws IOException {
        File parent = file.getParentFile();
        if (!parent.mkdirs()) {
            throw new IOException("Unable to create directory: " + parent.getAbsolutePath());
        }
    }

    private UserFile createUserFile(User user, String filename) {
        UserFile userFile = new UserFile();
        LocalDateTime creationDate = LocalDateTime.now();

        userFile.setPath(String.format("%s/%s/%s",
            RandomStringUtils.randomAlphanumeric(2).toLowerCase(),
            RandomStringUtils.randomAlphanumeric(2).toLowerCase(),
            RandomStringUtils.randomAlphanumeric(2).toLowerCase()));
        userFile.setName(filename);
        userFile.setCreatedAt(creationDate);
        userFile.setUpdatedAt(creationDate);
        userFile.setVolume(systemSettings.getActiveVolume());
        userFile.setStatus(UserFile.Status.SAVING);
        userFile.setSizeInBytes(0l);
        userFile.setUser(user);
        return repository.save(userFile);
    }
}
