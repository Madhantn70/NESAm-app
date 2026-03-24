package org.irtt.nesam.configuration;

import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;

@Configuration
@SecurityScheme(name = "Bearer Authentication", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", scheme = "bearer")
public class SwaggerConfig {

        // @Bean
        // public OperationCustomizer customGlobalHeaders() {
        // return (Operation operation, HandlerMethod handlerMethod) -> {
        // Parameter authTokenHeader = new Parameter()
        // .in(ParameterIn.HEADER.toString())
        // .schema(new StringSchema())
        // .name("Authorization")
        // .description("Bearer token for authentication")
        // .required(true);
        //
        // operation.addParametersItem(authTokenHeader);
        // return operation;
        // };
        // }

        @Bean
        public io.swagger.v3.oas.models.OpenAPI customOpenAPI() {
                final String securitySchemeName = "Bearer Authentication";

                return new io.swagger.v3.oas.models.OpenAPI()
                                .addSecurityItem(
                                                new io.swagger.v3.oas.models.security.SecurityRequirement()
                                                                .addList(securitySchemeName));
        }
}