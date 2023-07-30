package com.shooting.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "shooting")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Incident {
    
    @Id
    private String INCIDENT_KEY;
    private String OCCUR_DAT;
    private String BORO;
    private int PRECINT;
    private String VIC_SEX;
    private String VIC_RACE;
}
