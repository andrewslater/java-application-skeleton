package com.andrewslater.example.repositories;

import com.andrewslater.example.models.Volume;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolumeRepository extends CrudRepository<Volume, Integer> {

}
