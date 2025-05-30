package com.example.demo.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class Utilisateur {
    private String email;
    private String telephone;
    private String nom;
    private String prenom;
    private Date dateNaissance;
    private String username;
}
