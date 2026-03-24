package org.irtt.nesam.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.irtt.nesam.data.models.dto.UserProfileDTO;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest(ProfileControllerTest.class)
public class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ProfileRepository userRepository;

    @Test
    public void whenInvalidEmail_thenReturnsStatus400() throws Exception {
        // Record-based DTO is used here
        UserProfileDTO invalidUser = new UserProfileDTO(
                "1234567890",
                "John Doe",
                "not-an-email",
                "ID123"
        );

        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().is4xxClientError());
    }
}