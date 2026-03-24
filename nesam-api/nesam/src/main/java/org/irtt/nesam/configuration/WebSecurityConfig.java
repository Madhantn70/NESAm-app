package org.irtt.nesam.configuration;


import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.servlet.http.HttpServletRequest;
import org.irtt.nesam.services.TokenConverter;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ott.GenerateOneTimeTokenRequest;
import org.springframework.security.authentication.ott.InMemoryOneTimeTokenService;
import org.springframework.security.authentication.ott.OneTimeTokenService;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationConverter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.security.web.authentication.ott.DefaultGenerateOneTimeTokenRequestResolver;
import org.springframework.security.web.authentication.ott.GenerateOneTimeTokenRequestResolver;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;

@Configuration
@EnableWebSecurity
class WebSecurityConfig {

    @Value("${jwt.public.key}")
    RSAPublicKey key;

    @Value("${jwt.private.key}")
    RSAPrivateKey priv;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) {
        // @formatter:off
        http
                .authorizeHttpRequests(
                        authorizeRequests ->
                        authorizeRequests.requestMatchers("/swagger-ui/**")
                            .permitAll()
                        .requestMatchers("/v3/api-docs*/**")
                            .permitAll()
                        .requestMatchers("/", "/home","/api/v1/users/register","/api/v1/users/ott/token","/api/v1/users/ott/login")
                            .permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(Customizer.withDefaults())
                .oneTimeTokenLogin((ott) -> ott
                        .showDefaultSubmitPage(false)
                )
                .csrf((csrf) -> csrf.ignoringRequestMatchers("/api/v1/users/ott/token","/api/v1/users/register","/api/v1/users/ott/login"))
                .oauth2ResourceServer((oauth2) -> oauth2
                        .jwt((jwt) -> jwt
                                .jwtAuthenticationConverter(new TokenConverter())
                        )
                )
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .logout(LogoutConfigurer::permitAll);
        // @formatter:on

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("authorities");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer ignoringCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs*/**");
    }


    @Bean
    GenerateOneTimeTokenRequestResolver generateOneTimeTokenRequestResolver() {
        DefaultGenerateOneTimeTokenRequestResolver delegate = new DefaultGenerateOneTimeTokenRequestResolver();
        return (request) -> {
            GenerateOneTimeTokenRequest generate = delegate.resolve(request);
            return new GenerateOneTimeTokenRequest(generate.getUsername(), Duration.ofSeconds(600));
        };
    }

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(this.key).build();
    }

    @Bean
    JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(this.key).privateKey(this.priv).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    OneTimeTokenService oneTimeTokenService(){
        return new InMemoryOneTimeTokenService();
    }

}