package com.shooting.Service;

import com.shooting.Model.Incident;
import com.shooting.Repository.IncidentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository repository;

    //CRUD CREATE, READ, UPDATE, DELETE

    //CREATE
    public Incident addIncident(Incident incident) {
        incident.setINCIDENT_KEY(UUID.randomUUID().toString().split("-")[0]);
        return repository.save(incident);
    }



    //2 READ ALL
    public List<Incident> findAllIncidents() {
        return repository.findAll();
    }

    //2.1 READ SPECIFIC FIELD
    public Incident getIncidentByIncidentID(String incidentId) {
        return repository.findById(incidentId).get();
    }

    //2.2 READ BY PRECINT
    public List<Incident> getIncidentByPrecint (int precint) {
        return repository.findByPRECINT(precint);
    }

    //2.3 READ BY BORO
    public List<Incident> getIncidentByBoro (int boro) {
        return repository.getIncidentByBORO(boro);
    }

    //3 UPDATE
    public Incident updateIncident(Incident incidentRequest) {
        //get the existing document from DB
        Incident existingIncident = repository.findById(incidentRequest.getINCIDENT_KEY()).get();
        //populate new value from request to existing object/entity/document
        existingIncident.setOCCUR_DAT(incidentRequest.getOCCUR_DAT());
        existingIncident.setBORO(incidentRequest.getBORO());
        existingIncident.setPRECINT(incidentRequest.getPRECINT());
        existingIncident.setVIC_SEX(incidentRequest.getVIC_SEX());
        existingIncident.setVIC_RACE(incidentRequest.getVIC_RACE());
        return repository.save(existingIncident);
    }

    public String deleteIncident(String incidentId) {
        repository.deleteById(incidentId);
        return "The Incident has been Deleted: ";
    }
}
