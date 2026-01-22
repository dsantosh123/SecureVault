package com.securevault.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity                  // Tells Spring: "Create a table for Nominees"
@Table(name = "nominees")
@Data                    // Generates getters and setters
@NoArgsConstructor       // Required for JPA
@AllArgsConstructor      // Required for @Builder
@Builder                 // Allows us to create Nominee objects easily
public class Nominee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String relationship;

    private String phoneNumber;

    // This connects the Nominee to the User who added them
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "boolean default false")
    private Boolean identityConfirmed = false;

    public void setUser(User user) {
        this.user = user;
    }

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRelationship() {
		return relationship;
	}

	public void setRelationship(String relationship) {
		this.relationship = relationship;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Boolean getIdentityConfirmed() {
		return identityConfirmed;
	}

	public void setIdentityConfirmed(Boolean identityConfirmed) {
		this.identityConfirmed = identityConfirmed;
	}

	public User getUser() {
		return user;
	}
}