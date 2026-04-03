package org.irtt.nesam.infrastructure.external;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.stereotype.Component;
import java.util.function.Consumer;

@Slf4j
@Component
public class OttConsoleHandler implements Consumer<OneTimeToken> {
    @Override
    public void accept(OneTimeToken token) {
        log.info("=========================================");
        log.info("OTT GENERATED: Token [{}] for user [{}]", token.getTokenValue(), token.getUsername());
        log.info("=========================================");
    }
}
