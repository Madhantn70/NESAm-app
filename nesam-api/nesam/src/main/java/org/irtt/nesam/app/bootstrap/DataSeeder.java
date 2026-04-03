package org.irtt.nesam.app.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    // Inject repositories for system_parameters, master_membership_fee_slabs, etc., later when built

    @Override
    public void run(String... args) throws Exception {
        // Will seed core IRTTAA data and parameters if tables are empty.
    }
}
