package com.securevault.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("🔍 [JwtFilter] Token received: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token));

            try {
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
                
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String userId = claims.getSubject();
                List<String> roles = (List<String>) claims.get("roles");
                System.out.println("✅ [JwtFilter] Token verified for userId: " + userId + ", roles: " + roles);

                if (userId != null) {
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    if (roles != null) {
                        authorities = roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());
                    }
                    
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            userId, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("✅ [JwtFilter] Authentication set in SecurityContext");
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                System.err.println("❌ [JwtFilter] JWT VERIFICATION FAILED: " + e.getMessage());
                // e.printStackTrace(); 
            }
        } else {
            // System.out.println("⚠️ [JwtFilter] No Bearer token found in header");
        }

        filterChain.doFilter(request, response);
    }
}
