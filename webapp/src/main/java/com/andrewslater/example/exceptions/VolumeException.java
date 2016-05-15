package com.andrewslater.example.exceptions;

public class VolumeException extends RuntimeException {

    public VolumeException(String message) {
        super(message);
    }

    public VolumeException(String message, Throwable throwable) {
        super(message, throwable);
    }

    public VolumeException(Throwable throwable) {
        super(throwable);
    }
}
