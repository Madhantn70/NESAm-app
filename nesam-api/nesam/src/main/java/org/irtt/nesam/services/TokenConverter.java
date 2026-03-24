package org.irtt.nesam.services;

import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public class TokenConverter  implements Converter<Jwt, AbstractAuthenticationToken> {
    public AbstractAuthenticationToken convert(Jwt jwt) {
        System.out.println(jwt);
        User user = new User("user.getEmail()", " user.getPassword()", List.of(new GrantedAuthority() {
            @Override
            public @Nullable String getAuthority() {
                return "test";
            }
        }));
        return new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()

        );
    }
}