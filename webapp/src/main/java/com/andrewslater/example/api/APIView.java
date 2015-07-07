package com.andrewslater.example.api;

public class APIView {
    public interface Public { }
    public interface Authenticated extends Public { }
    public interface Internal extends Authenticated { }
}
