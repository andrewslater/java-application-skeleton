package com.andrewslater.skeleton.maven;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;

import java.io.File;
import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Mojo(name = "new-migration")
public class NewMigrationMojo extends AbstractMojo
{
    public enum TimestampResolution { SECONDS, MILLIS }

    @Parameter(name = "migrationsDir")
    private String migrationsDir;

    @Parameter(name = "timezone", defaultValue = "America/Los_Angeles")
    private String timezone;

    @Parameter(property = "migrationName")
    private String migrationName;

    @Parameter(name = "timestampResolution", defaultValue = "SECONDS")
    private TimestampResolution timestampResolution;

    public void execute() throws MojoExecutionException
    {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(timezone));

        String sanitizedName = migrationName != null ? migrationName.replace(' ', '-') : "";
        long timestamp;

        switch(timestampResolution) {
            case MILLIS:
                timestamp = now.toInstant().toEpochMilli();
                break;

            case SECONDS:
                timestamp = now.toInstant().getEpochSecond();
                break;

            default:
                throw new MojoExecutionException("Invalid timestamp resolution. Must be either SECONDS or MILLIS");
        }
        String migrationFilename = String.format("V%d__%s.sql", timestamp, sanitizedName);
        getLog().info("Creating new migration in: " + migrationsDir);
        getLog().info("Migration filename: " + migrationFilename);

        File parentDir = new File(migrationsDir);

        if (!parentDir.exists()) {
            throw new MojoExecutionException("Migrations directory does not exist: " + migrationsDir);
        }
        File migrationFile = new File(parentDir, migrationFilename);
        if (migrationFile.exists()) {
            throw new MojoExecutionException("Migration already exists: " + migrationFile.getAbsolutePath());
        }

        try {
            migrationFile.createNewFile();
        } catch (IOException ex) {
            throw new MojoExecutionException("Failed to create migration file: " + migrationFile.getAbsolutePath(), ex);
        }
    }
}
