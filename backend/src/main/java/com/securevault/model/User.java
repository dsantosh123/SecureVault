package com.securevault.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // Useful for creating User objects easily later
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    private String accountType;

    public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

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

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public Integer getInactivityDays() {
		return inactivityDays;
	}

	public void setInactivityDays(Integer inactivityDays) {
		this.inactivityDays = inactivityDays;
	}

	public LocalDateTime getLastLoginAt() {
		return lastLoginAt;
	}

	public void setLastLoginAt(LocalDateTime lastLoginAt) {
		this.lastLoginAt = lastLoginAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Boolean getIsTrustVerified() {
		return isTrustVerified;
	}

	public void setIsTrustVerified(Boolean isTrustVerified) {
		this.isTrustVerified = isTrustVerified;
	}

	private String country;

    private Integer inactivityDays;

    private LocalDateTime lastLoginAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(columnDefinition = "boolean default false")
    private Boolean isTrustVerified = false;
}