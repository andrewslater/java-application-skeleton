package com.andrewslater.example.repositories;

import com.andrewslater.example.models.Volume;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface VolumeRepository extends JpaRepository<Volume, Integer> {

    Page<Volume> findByNameContainingOrPathContainingAllIgnoreCase(String email, String fullName, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Volume SET usageInBytes = usageInBytes + :bytesWritten WHERE volumeId = :volumeId")
    void updateVolumeUsage(@Param("bytesWritten") long bytesWritten, @Param("volumeId") int id);
}
