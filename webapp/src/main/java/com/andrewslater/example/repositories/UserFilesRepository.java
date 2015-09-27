package com.andrewslater.example.repositories;

import com.andrewslater.example.models.UserFile;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserFilesRepository extends PagingAndSortingRepository<UserFile, Long> {

}
