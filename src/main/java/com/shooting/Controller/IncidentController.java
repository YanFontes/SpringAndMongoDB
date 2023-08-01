package com.shooting.Controller;

import com.shooting.Model.Incident;
import com.shooting.Service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Incident")
public class IncidentController {

    @Autowired
    private IncidentService service;

    // Endpoint to create a new incident
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Incident createIncident(@RequestBody Incident incident) {
        return service.addIncident(incident);
    }

    // Endpoint to retrieve all incidents
    @GetMapping
    public List<Incident> getIncidents() {
        return service.findAllIncidents();
    }

    // Endpoint to retrieve an incident by its ID
    @GetMapping("/{incidentId}")
    public Incident getIncident(@PathVariable String incidentId) {
        return service.getIncidentByIncidentID(incidentId);
    }

    // Endpoint to find incidents by precinct
    @GetMapping("/precint/{precint}")
    public List<Incident> findIncidentUsingPrecint(@PathVariable int precint) {
        return service.getIncidentByPrecint(precint);
    }

    // Endpoint to find incidents by borough
    @GetMapping("/boro/{boro}")
    public List<Incident> getIncidentByBoro(@PathVariable int boro) {
        return service.getIncidentByBoro(boro);
    }

    // Endpoint to modify an existing incident
    @PutMapping
    public Incident modifyIncident(@RequestBody Incident incident) {
        return service.updateIncident(incident);
    }

    // Endpoint to delete an incident by its ID
    @DeleteMapping("/{incidentId}")
    public ResponseEntity<String> deleteIncident(@PathVariable String incidentId) {
        String result = service.deleteIncident(incidentId);
        if (result.equals("Incident deleted successfully")) {
            return ResponseEntity.ok().body("{\"message\": \"Incident deleted successfully\"}");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Error deleting incident\"}");
        }
    }

    // Endpoint for search by incident ID
    @GetMapping("/key/{incidentId}")
    public Incident getIncidentByIncidentID(@PathVariable String incidentId) {
        return service.getIncidentByIncidentID(incidentId);
    }
}
