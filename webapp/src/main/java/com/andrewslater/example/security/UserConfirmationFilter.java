package com.andrewslater.example.security;

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

public class UserConfirmationFilter extends SecurityContextHolderAwareRequestFilter {

    private static final Logger LOG = LoggerFactory.getLogger(UserConfirmationFilter.class);

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain filterChain) throws ServletException, IOException {

        HttpServletRequest req = (HttpServletRequest)request;
        HttpServletResponse res = (HttpServletResponse)response;

        String resourcesUri = req.getContextPath() + "/resources";
        String unconfirmedUri = req.getContextPath() + "/unconfirmed";
        String confirmUri = req.getContextPath() + "/confirm";

        if (req.getRequestURI().startsWith(resourcesUri) ||
            req.getRequestURI().startsWith(unconfirmedUri) ||
            req.getRequestURI().startsWith(confirmUri)) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            User user = ((SecurityUser)auth.getPrincipal()).getUser();

            if (user.requiresAccountConfirmation() && !req.getRequestURI().startsWith(unconfirmedUri)) {
                if (!res.isCommitted()) {
                    res.sendRedirect(unconfirmedUri);
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }


}
