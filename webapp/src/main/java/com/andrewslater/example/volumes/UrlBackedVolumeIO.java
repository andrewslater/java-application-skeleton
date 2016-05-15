package com.andrewslater.example.volumes;

import com.andrewslater.example.models.Volume;

import java.net.URL;

public interface UrlBackedVolumeIO extends VolumeIO {
    URL getURL(Volume volume, String path);
    URL getURL(Volume volume, String path, Integer secondsValid);
}
