package com.andrewslater.example.repositories;

import com.andrewslater.example.models.User;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    User findByEmailIgnoreCase(@Param("email") String email);
    User findByConfirmationToken(String confirmationToken);
}
