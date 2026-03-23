package com.rtap.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(JdbcTemplate jdbc, PasswordEncoder encoder) {
        return args -> {
            Integer count = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE username = ?",
                    Integer.class,
                    "Esun"
            );

            if (count != null && count == 0) {
                jdbc.update(
                        "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                        "Esun",
                        encoder.encode("Esunadmin"),
                        "ADMIN"
                );
                System.out.println("✅ Default admin user created: Esun / Esunadmin");
            }
        };
    }
}
