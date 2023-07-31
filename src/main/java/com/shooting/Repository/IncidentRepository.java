package com.shooting.Repository;

import com.shooting.Model.Incident;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface IncidentRepository extends MongoRepository<Incident, String> {
    List<Incident> findByPRECINT(int precint);

    @Query("{BORO: ?0}")
    List<Incident> getIncidentByBORO(int boro);

}


