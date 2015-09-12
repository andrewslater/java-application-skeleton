package com.andrewslater.example;

import org.apache.commons.lang.StringUtils;
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
    public static final String ADMIN_API_USER_DETAILS = "/api/admin/user/{userId}";
    public static final String ADMIN_API_LIST_USERS = "/api/admin/users";
    public static final String ADMIN_API_SETTINGS = "/api/admin/settings";

    // Authenticated API
    public static final String API_USER_RESOURCE = "/api/user/{userId}";
    public static final String API_PRINCIPAL_RESOURCE = "/api/user/principal";

    private static final Pattern PROPS_PATTERN = Pattern.compile("\\{(.+?)\\}");

    public static Link getLink(String path, String ref) {
        return new Link(
            ServletUriComponentsBuilder.fromCurrentContextPath().path(path).toUriString(), ref);
    }

    public static Link getLink(String path, Map<String, Object> props, String ref) {
        return getLink(composePath(path, props), ref);
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
