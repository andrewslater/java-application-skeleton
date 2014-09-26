package com.andrewslater.gui;

import javafx.application.Application;
import javafx.stage.Stage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Main extends Application {

    private static final Logger LOG = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        launch(args);
    }

    public void start(Stage stage) throws Exception {
        LOG.info("Starting java-application-skeleton-gui");
        ApplicationContext context = new AnnotationConfigApplicationContext(GUIContextConfiguration.class);
    }
}
