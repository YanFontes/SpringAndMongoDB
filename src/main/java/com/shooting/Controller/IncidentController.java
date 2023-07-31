package com.shooting.Controller;

import com.shooting.Model.Incident;
import com.shooting.Service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping("/Incident")
public class IncidentController {

    @Autowired
    private IncidentService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Incident createIncident(@RequestBody Incident incident) {
        return service.addIncident(incident);
    }

    @GetMapping
    public List<Incident> getIncidents() {
        return service.findAllIncidents();
    }

    @GetMapping("/{incidentId}")
    public Incident getIncident(@PathVariable String incidentId) {
        return service.getIncidentByIncidentID(incidentId);
    }

    @GetMapping("/precint/{precint}")
    public List<Incident> findIncidentUsingPrecint(@PathVariable int precint) {
        return service.getIncidentByPrecint(precint);
    }

    @GetMapping("/boro/{boro}")
    public List<Incident> getIncidentByBoro(@PathVariable int boro) {
        return service.getIncidentByBoro(boro);
    }

    @PutMapping
    public Incident modifyIncident(@RequestBody Incident incident) {
        return service.updateIncident(incident);
    }

    @DeleteMapping("/{incidentId}")
    public ResponseEntity<String> deleteIncident(@PathVariable String incidentId) {
        try {
            // Code to delete the incident with the given incidentId from the database
            // ...

            // Assuming the incident was successfully deleted, return a success message with 200 OK status
            return ResponseEntity.ok("Incident deleted successfully");
        } catch (Exception e) {
            // If there's an error during deletion, return an error message with 500 Internal Server Error status
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting incident");
        }

    }
}

