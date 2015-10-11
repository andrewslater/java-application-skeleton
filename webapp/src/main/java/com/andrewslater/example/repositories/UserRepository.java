package com.andrewslater.example.repositories;

import com.andrewslater.example.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmailIgnoreCase(@Param("email") String email);
    User findByConfirmationToken(String confirmationToken);
    Page<User> findByEmailContainingOrFullNameContainingAllIgnoreCase(String email, String fullName,
        Pageable pageable);
}
