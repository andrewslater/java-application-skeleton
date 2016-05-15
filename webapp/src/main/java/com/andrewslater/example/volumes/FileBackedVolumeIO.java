package com.andrewslater.example.volumes;

import com.andrewslater.example.models.Volume;

import java.io.File;

public interface FileBackedVolumeIO extends VolumeIO {
    File getFile(Volume volume, String storagePath);
}
