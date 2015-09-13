package com.andrewslater.example;

import com.google.common.collect.Maps;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class MappingsTest {

    private static final String PATH = "/users/{userId}/address/{street}";

    @Test
    public void testComposePathWithMap() {
        Map<String, Object> props = new HashMap<>();
        props.put("userId", 229);
        props.put("street", "MainSt");

        Assert.assertEquals("/users/229/address/MainSt", Mappings.composePath(PATH, props));
    }

    @Test
    public void testComposePathWithVarargs() {
        Assert.assertEquals("/users/123/address/SouthSt", Mappings.composePath(PATH, 123, "SouthSt"));
    }

    public void generateRandomUsers() {
        List<String> firstNames = Arrays.asList("Allen", "Alex", "Anakin", "Bob", "Bilbert", "Brenden", "Brosephene", "Carlos", "Chris", "Carter", "Darren", "Dexter", "Damian", "Doonsbury", "Earl", "Esther", "Ernie", "Fred", "Frederick", "Fandango", "Gertrude", "Gerry", "Gunner", "Hal", "Henry", "Homer", "Ingrid", "Jackson", "Jon", "Jacky", "Kensington", "Lenny", "Lester", "Manny", "Marcus", "Neo", "Pamela", "Pat", "Quentin", "Rose", "Samantha", "Tucker", "Tiffany", "Ursula", "Veronica", "Wilber", "Xander", "Zeke");
        List<String> lastNames = Arrays.asList("Anderson", "Bartholomew", "Carter", "Dillington", "Evans", "Fredrickson", "Hill", "Jackson", "Kensington", "Lamas", "Montross", "Neomonde", "O''leary", "Perkins", "Penske", "Quaid", "Queensbreath", "Rodgers", "Richards", "Renault", "Sims", "Ssimpson", "Thompson", "Tilly", "Underwood", "Vincent", "Walters", "Wimbledorf", "Young", "Zolton");
        List<String> domains = Arrays.asList("yopmail.com", "mailinator.com", "spambooger.com", "binkmail.com", "veryrealemail.com", "zippymail.info");
        List<String> emails = new ArrayList<>();

        Random random = new Random();

        for (int i = 0; i < 10000; i++) {
            String firstName = firstNames.get(random.nextInt(firstNames.size()));
            String lastName = lastNames.get(random.nextInt(lastNames.size()));
            String domain = domains.get(random.nextInt(domains.size()));
            String email = String.format("%s@%s", firstName.toLowerCase(), domain);

            while (emails.contains(email)) {
                email = String.format("%s%d@%s", firstName.toLowerCase(), random.nextInt(1000), domain);
            }

            emails.add(email);

            System.out.println(String.format("INSERT INTO users VALUES (NEXTVAL('users_id_seq'), '%s', null, '%s %s', true, '$2a$10$S30wfsLaAUrPLjEKZ981Vuy6xAK/TpL6pOFgi8VlDhBtoz.r0gBGe', null, now(), null);", email, firstName, lastName));
        }
    }
}
