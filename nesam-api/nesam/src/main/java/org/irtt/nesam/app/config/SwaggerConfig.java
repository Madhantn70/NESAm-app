package org.irtt.nesam.app.config;

import org.springframework.context.annotation.Bean;

// Disabled to prevent conflicts with OpenApiConfig.java
//@Configuration
//@SecurityScheme(name = "Bearer Authentication", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", scheme = "bearer")
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

        // @Bean
        public io.swagger.v3.oas.models.OpenAPI customOpenAPI() {
                final String securitySchemeName = "Bearer Authentication";

                return new io.swagger.v3.oas.models.OpenAPI()
                                .addSecurityItem(
                                                new io.swagger.v3.oas.models.security.SecurityRequirement()
                                                                .addList(securitySchemeName));
        }
}