package com.andrewslater.example.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

public class SortQuery {
    private static final Logger LOG = LoggerFactory.getLogger(SortQuery.class);

    public static Sort toSort(String sortQuery) {
        List<Sort.Order> orders = new ArrayList<>();
        for (String orderPart : sortQuery.split(",")) {
            String[] queryParts = orderPart.split(":");

            if (queryParts.length != 2) {
                throw new RuntimeException("Invalid sort query: " + sortQuery);
            }

            String property = queryParts[0];
            String order = queryParts[1].toUpperCase();
            orders.add(new Sort.Order(Sort.Direction.fromStringOrNull(order), property));
        }
        return new Sort(orders);
    }
}
