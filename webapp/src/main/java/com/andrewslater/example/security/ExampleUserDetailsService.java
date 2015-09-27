package com.andrewslater.example.security;

import com.andrewslater.example.repositories.UserFilesRepository;
import com.andrewslater.example.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class ExampleUserDetailsService implements UserDetailsService {

    private static final Logger LOG = LoggerFactory.getLogger(ExampleUserDetailsService.class);

    @Autowired
    private UserRepository repository;

    @Autowired
    private UserFilesRepository filesRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return new SecurityUser(repository.findByEmailIgnoreCase(username));
    }
}
