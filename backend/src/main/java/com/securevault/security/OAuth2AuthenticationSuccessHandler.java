package com.securevault.security;

import com.securevault.model.User;
import com.securevault.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    public OAuth2AuthenticationSuccessHandler(UserRepository userRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        System.out.println("🔍 [OAuth2SuccessHandler] Authentication success for: " + email);

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtUtils.generateToken(user.getId());
            System.out.println("✅ [OAuth2SuccessHandler] Generated token for userId: " + user.getId());
            
            String frontendUrl = allowedOrigins.split(",")[0]; // Use first allowed origin

            String targetUrl = UriComponentsBuilder
                    .fromUriString(frontendUrl + "/oauth2/callback")
                    .queryParam("token", token)
                    .queryParam("email", user.getEmail())
                    .queryParam("fullName", user.getFullName())
                    .build()
                    .toUriString();

            System.out.println("🔄 [OAuth2SuccessHandler] Redirecting to: " + targetUrl);
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } else {
            System.err.println("❌ [OAuth2SuccessHandler] User not found in database for email: " + email);
            String frontendUrl = allowedOrigins.split(",")[0];
            getRedirectStrategy().sendRedirect(
                    request,
                    response,
                    frontendUrl + "/login?error=user_not_found"
            );
        }
    }
}
