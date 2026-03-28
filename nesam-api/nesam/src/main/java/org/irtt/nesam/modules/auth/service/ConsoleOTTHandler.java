package org.irtt.nesam.modules.auth.service;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.ott.OneTimeTokenGenerationSuccessHandler;
import org.springframework.security.web.authentication.ott.RedirectOneTimeTokenGenerationSuccessHandler;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import org.irtt.nesam.modules.user.service.UserService;

//TODO: Change this component to use Text/Email provider
@Component
@Slf4j
@RequiredArgsConstructor
public class ConsoleOTTHandler implements OneTimeTokenGenerationSuccessHandler {

    private final OneTimeTokenGenerationSuccessHandler redirectHandler = new RedirectOneTimeTokenGenerationSuccessHandler("/ott/dispatch");

    private final UserService profileService;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, OneTimeToken oneTimeToken) throws IOException, ServletException {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(UrlUtils.buildFullRequestUrl(request))
                .replacePath(request.getContextPath())
                .replaceQuery(null)
                .fragment(null)
                .path("/login/ott")
                .queryParam("token", oneTimeToken.getTokenValue());
        String magicLink = builder.toUriString();
        UserDetails userDetails = profileService.loadUserByUsername(oneTimeToken.getUsername());
        log.info("Testing: token url {}",magicLink);
        this.redirectHandler.handle(request, response, oneTimeToken);

    }
}
