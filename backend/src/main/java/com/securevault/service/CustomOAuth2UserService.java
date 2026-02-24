package com.securevault.service;

import com.securevault.model.User;
import com.securevault.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setFullName(name);
            user.setLastLoginAt(LocalDateTime.now());
        } else {
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setPassword(""); // OAuth user has no password
            user.setAccountType("OAUTH");
            user.setCreatedAt(LocalDateTime.now());
            user.setLastLoginAt(LocalDateTime.now());
        }

        userRepository.save(user);

        return oAuth2User;
    }
}
