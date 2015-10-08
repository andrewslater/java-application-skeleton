package com.andrewslater.example.api;

/**
 * This is used in conjunction with @JsonView to conditionally restrict access to specific properties
 */
public class APIView {
    public interface Public { }
    public interface Authenticated extends Public { }
    public interface Internal extends Authenticated { }
}
