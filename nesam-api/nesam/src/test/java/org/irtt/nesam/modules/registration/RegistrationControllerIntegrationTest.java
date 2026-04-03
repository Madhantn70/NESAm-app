package org.irtt.nesam.modules.registration;

import org.irtt.nesam.modules.alumni.domain.model.AaAlumniMaster;
import org.irtt.nesam.modules.alumni.repository.AaAlumniMasterRepository;
import org.irtt.nesam.modules.alumni.domain.model.AaAlumniMembershipType;
import org.irtt.nesam.modules.registration.controller.RegistrationController;
import org.irtt.nesam.modules.registration.controller.RegistrationExceptionHandler;
import org.irtt.nesam.modules.registration.domain.model.ApplicationStatus;
import org.irtt.nesam.modules.registration.domain.model.NESAmApplication;
import org.irtt.nesam.modules.registration.repository.NESAmApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.LocalDate;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class RegistrationControllerIntegrationTest {

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
    }

    private MockMvc mockMvc;

    @Autowired
    private RegistrationController registrationController;

    @Autowired
    private RegistrationExceptionHandler registrationExceptionHandler;

    @Autowired
    private AaAlumniMasterRepository alumniRepository;

    @Autowired
    private NESAmApplicationRepository applicationRepository;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(registrationController)
                .setControllerAdvice(registrationExceptionHandler)
                .build();

        applicationRepository.deleteAll();
        alumniRepository.deleteAll();

        // Setup Eligible Alumni
        AaAlumniMaster eligible = new AaAlumniMaster();
        eligible.setEmailId("eligible@example.com");
        eligible.setMembershipType(AaAlumniMembershipType.LIFE);
        eligible.setFullName("Test User");
        eligible.setDateOfBirth(LocalDate.of(1990, 1, 1));
        alumniRepository.save(eligible);

        // Setup Registered Only
        AaAlumniMaster registered = new AaAlumniMaster();
        registered.setEmailId("registered@example.com");
        registered.setMembershipType(AaAlumniMembershipType.REGISTERED);
        alumniRepository.save(registered);

        // Setup Pending Application
        AaAlumniMaster pendingAlumni = new AaAlumniMaster();
        pendingAlumni.setEmailId("pending@example.com");
        pendingAlumni.setMembershipType(AaAlumniMembershipType.LIFE);
        alumniRepository.save(pendingAlumni);

        NESAmApplication app = new NESAmApplication();
        app.setEmailId("pending@example.com");
        app.setStatus(ApplicationStatus.STARTED);
        app.setStartedAt(Instant.now());
        applicationRepository.save(app);
    }

    @Test
    void testInitiate_withEligibleEmail_returnsELIGIBLE() throws Exception {
        mockMvc.perform(post("/api/v1/public/registration/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"eligible@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("ELIGIBLE")));
    }

    @Test
    void testInitiate_withPendingApplication_returnsPENDING_APPLICATION() throws Exception {
        mockMvc.perform(post("/api/v1/public/registration/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"pending@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("PENDING_APPLICATION")));
    }

    @Test
    void testInitiate_withUnknownEmail_returnsNOT_FOUND() throws Exception {
        mockMvc.perform(post("/api/v1/public/registration/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"unknown@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("NOT_FOUND")));
    }

    @Test
    void testInitiate_withRegisteredOnlyMember_returnsNOT_A_MEMBER() throws Exception {
        mockMvc.perform(post("/api/v1/public/registration/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"registered@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("NOT_A_MEMBER")));
    }

    @Test
    void testSendOtp_withValidEmail_returnsSuccess() throws Exception {
        mockMvc.perform(post("/api/v1/public/registration/send-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"eligible@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("\"success\":true")));
    }
}
