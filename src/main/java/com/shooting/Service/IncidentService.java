package com.shooting.Service;

import com.shooting.Model.Incident;
import com.shooting.Repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository repository;

    // CRUD - CREATE, READ, UPDATE, DELETE

    // CREATE: Add a new incident to the database
    public Incident addIncident(Incident incident) {
        // Generate a unique INCIDENT_KEY using UUID
        incident.setINCIDENT_KEY(UUID.randomUUID().toString().split("-")[0]);
        return repository.save(incident);
    }

    // READ ALL: Get all incidents from the database
    public List<Incident> findAllIncidents() {
        return repository.findAll();
    }

    // READ BY INCIDENT ID: Get an incident by its INCIDENT_KEY
    public Incident getIncidentByIncidentID(String incidentId) {
        return repository.findById(incidentId).get();
    }

    // READ BY PRECINCT: Get all incidents by a specific precinct
    public List<Incident> getIncidentByPrecint(int precinct) {
        return repository.findByPRECINT(precinct);
    }

    // READ BY BORO: Get all incidents by a specific borough
    public List<Incident> getIncidentByBoro(int boro) {
        return repository.getIncidentByBORO(boro);
    }

    // UPDATE: Update an existing incident in the database
    public Incident updateIncident(Incident incidentRequest) {
        // Get the existing document from the database
        Incident existingIncident = repository.findById(incidentRequest.getINCIDENT_KEY()).get();
        // Populate new values from the request to the existing object/entity/document
        existingIncident.setOCCUR_DAT(incidentRequest.getOCCUR_DAT());
        existingIncident.setBORO(incidentRequest.getBORO());
        existingIncident.setPRECINT(incidentRequest.getPRECINT());
        existingIncident.setVIC_SEX(incidentRequest.getVIC_SEX());
        existingIncident.setVIC_RACE(incidentRequest.getVIC_RACE());
        return repository.save(existingIncident);
    }

    // DELETE: Delete an incident by its INCIDENT_KEY
    public String deleteIncident(String incidentId) {
        Optional<Incident> incidentOptional = repository.findById(incidentId);
        if (incidentOptional.isPresent()) {
            repository.deleteById(incidentId);
            return "Incident deleted successfully";
        } else {
            return "Incident not found"; // Return an appropriate message if the incident does not exist
        }
    }
}
