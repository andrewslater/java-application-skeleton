package com.andrewslater.skeleton.gui;

import javafx.application.Application;
import javafx.stage.Stage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class GUI extends Application {

    private static final Logger LOG = LoggerFactory.getLogger(GUI.class);

    public static void main(String[] args) {
        launch(args);
    }

    public void start(Stage stage) throws Exception {
        LOG.info("Starting java-application-skeleton-skeleton");
        ApplicationContext context = new AnnotationConfigApplicationContext(GUIContextConfiguration.class);
    }
}
