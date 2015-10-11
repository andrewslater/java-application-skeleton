package com.andrewslater.example.api;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;

public class SortQueryTest {
    private static final Logger LOG = LoggerFactory.getLogger(SortQueryTest.class);

    @Test
    public void testSortQuery() {
        String query = "fullName:ASC,lastLogin:DESC";
        Sort sort = SortQuery.toSort(query);
    }
}
