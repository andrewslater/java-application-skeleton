package com.andrewslater.skeleton.maven;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.codehaus.plexus.util.FileUtils;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Mojo(name = "seed-users")
public class SeedUsersMojo extends AbstractMojo
{
    @Parameter(property = "numUsers", defaultValue = "1000")
    private String numUsers;

    @Parameter(property = "output")
    private String output;

    public void execute() throws MojoExecutionException
    {
        List<String> firstNames = Names.FIRSTNAMES;
        List<String> surnames = Names.SURNAMES;
        List<String> domains = Arrays
            .asList("yopmail.com", "mailinator.com", "spambooger.com", "blinkmail.com",
                "veryrealemail.com", "zippymail.info");
        List<String> emails = new ArrayList<>();

        Random random = new Random();

        Integer parsedNumUsers;
        try {
            parsedNumUsers = Integer.parseInt(numUsers);
        } catch (NumberFormatException ex) {
            throw new MojoExecutionException("Invalid number of users given: " + numUsers);
        }

        File outputFile = null;
        if (output != null) {
            outputFile = new File(output);

            if (outputFile.exists()) {
                throw new MojoExecutionException("Output file already exists: " + outputFile.getAbsolutePath());
            }
        }


        for (int i = 0; i < parsedNumUsers; i++) {
            String firstName = firstNames.get(random.nextInt(firstNames.size()));
            String lastName = surnames.get(random.nextInt(surnames.size()));
            String domain = domains.get(random.nextInt(domains.size()));
            String email = String.format("%s@%s", firstName.toLowerCase(), domain);

            while (emails.contains(email)) {
                email = String.format("%s%d@%s", firstName.toLowerCase(), random.nextInt(1000), domain);
            }

            emails.add(email);

            String lastLogin = Math.random() >= 0.05 ? "(SELECT NOW() - '1 minute'::INTERVAL * ROUND(RANDOM() * 9999999))" : "null";
            String insertUser = String.format(
                "INSERT INTO users VALUES (NEXTVAL('users_id_seq'), '%s', null, '%s %s', true, '$2a$10$S30wfsLaAUrPLjEKZ981Vuy6xAK/TpL6pOFgi8VlDhBtoz.r0gBGe', %s, (SELECT NOW() - '1 minute'::INTERVAL * ROUND(RANDOM() * 9999999)), null);\n",
                email, firstName, lastName, lastLogin);
            String insertRoles = String.format(
                "INSERT INTO user_roles VALUES((SELECT id FROM users WHERE email = '%s'), 'USER');\n", email);

            if (outputFile != null) {
                try {
                    FileUtils.fileAppend(output, "utf-8", insertUser);
                    FileUtils.fileAppend(output, "utf-8", insertRoles);
                } catch (IOException ex) {
                    throw new MojoExecutionException("Failed to write to file: " + output);
                }
            } else {
                System.out.println(insertUser);
            }
        }
    }

}
