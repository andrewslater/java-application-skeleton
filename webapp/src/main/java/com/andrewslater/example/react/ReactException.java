package com.andrewslater.example.react;

public class ReactException extends RuntimeException {

    public ReactException(String message) {
        super(message);
    }

    public ReactException(String message, Throwable throwable) {
        super(message, throwable);
    }

    public ReactException(Throwable throwable) {
        super(throwable);
    }
}
