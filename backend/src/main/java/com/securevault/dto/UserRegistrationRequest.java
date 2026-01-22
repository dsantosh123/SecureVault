package com.securevault.dto;

public class UserRegistrationRequest {
    private String email;
    private String password;
    private String fullName;
    private String country;
    private String accountType;
    private String otp; // ✅ ADD THIS
    
    // All getters and setters including:
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getAccountType() {
		return accountType;
	}
	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}
    
}