package com.securevault.dto;

public class UserRegistrationRequest {

    private String email;
    private String password;
    private String fullName;
    private String accountType;
    private String country;

    // Standard No-Args Constructor
    public UserRegistrationRequest() {}

    // GETTERS (These fix the "undefined" errors)
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public String getAccountType() { return accountType; }
    public String getCountry() { return country; }

    // SETTERS (Needed so Spring can fill this object with data from React)
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public void setCountry(String country) { this.country = country; }
}