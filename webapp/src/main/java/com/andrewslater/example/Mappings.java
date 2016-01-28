package com.andrewslater.example;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Mappings {
    private static final Logger LOG = LoggerFactory.getLogger(Mappings.class);

    // Admin API
    private static final String ADMIN_API_BASE = "/api/admin/";
    public static final String ADMIN_API_USER_DETAILS = ADMIN_API_BASE + "user/{userId}";
    public static final String ADMIN_API_LIST_USERS =   ADMIN_API_BASE + "users";
    public static final String ADMIN_API_SETTINGS =     ADMIN_API_BASE + "settings";

    // Authenticated API
    private static final String API_BASE = "/api/";
    public static final String API_AVATAR_SIZES =       API_BASE + "/avatar-sizes";
    public static final String API_USER_RESOURCE =      API_BASE + "user/{userId}";
    public static final String API_PRINCIPAL_RESOURCE = API_BASE + "user";
    public static final String API_USER_AVATAR =   API_BASE + "user/{userId}/avatar";

    private static final Pattern PROPS_PATTERN = Pattern.compile("\\{(.+?)\\}");

    public static Link getLink(String ref, String path) {
        return new Link(
            ServletUriComponentsBuilder.fromCurrentContextPath().path(path).toUriString(), ref);
    }

    public static Link getLink(String path, Map<String, Object> props, String ref) {
        return getLink(ref, composePath(path, props));
    }

    public static String composePath(String path, Object ... props) {
        Matcher matcher = PROPS_PATTERN.matcher(path);
        int propCounter = 0;

        while (matcher.find()) {
            if (props.length <= propCounter) {
                throw new RuntimeException(String.format("Path %s was only supplied with %d props", path, props.length));
            }
            path = StringUtils.replace(path, matcher.group(), props[propCounter].toString());
            propCounter++;
        }
        return path;
    }

    public static String composePath(String path, Map<String, Object> props) {

        Matcher matcher = PROPS_PATTERN.matcher(path);

        while (matcher.find()) {
            String propName = matcher.group().replaceAll("[\\{\\}]", "");
            if (props.containsKey(propName)) {
                path = path.replaceAll("\\{" + propName + "\\}", props.get(propName).toString());
            }
        }

        return path;
    }
}
