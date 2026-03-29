package org.irtt.nesam;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.TimeZone;

@SpringBootApplication
public class NesamApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		SpringApplication.run(NesamApplication.class, args);
	}

	@Bean
	public CommandLineRunner verifyStartup(DataSource dataSource) {
		return args -> {
			try (Connection connection = dataSource.getConnection()) {
				System.out.println("========================================");
				System.out.println("Database connection success: " + connection.getMetaData().getURL());
				System.out.println("Application startup success");
				System.out.println("Tomcat running on port: 9090");
				System.out.println("========================================");
			} catch (Exception e) {
				System.err.println("Database connection failed: " + e.getMessage());
			}
		};
	}

}
