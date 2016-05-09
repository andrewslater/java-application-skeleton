package com.andrewslater.example.security;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class UserConfirmationAPIFilter extends SecurityContextHolderAwareRequestFilter {
    private static final Logger LOG = LoggerFactory.getLogger(UserConfirmationFilter.class);

    @Override
    public void doFilter(ServletRequest request,
        ServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

        HttpServletRequest req = (HttpServletRequest)request;
        HttpServletResponse res = (HttpServletResponse)response;

        if (req.getRequestURI().startsWith(Mappings.API_CONFIRMATION_EMAIL)) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            User user = ((SecurityUser)auth.getPrincipal()).getUser();

            if (user.requiresAccountConfirmation()) {
                if (!res.isCommitted()) {
                    res.getWriter().write("{\"error\": \"Account is unconfirmed\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
