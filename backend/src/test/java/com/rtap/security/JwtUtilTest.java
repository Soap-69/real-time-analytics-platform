package com.rtap.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        // 32+ char secret required for HS256
        jwtUtil = new JwtUtil("test-secret-that-is-long-enough-32plus", 3600L);
    }

    @Test
    void generateAndValidate_roundTrip() {
        String token = jwtUtil.generate("alice");
        assertThat(jwtUtil.validateAndGetSubject(token)).isEqualTo("alice");
    }

    @Test
    void validate_expiredToken_throws() {
        JwtUtil shortLived = new JwtUtil("test-secret-that-is-long-enough-32plus", 0L);
        String token = shortLived.generate("bob");
        assertThatThrownBy(() -> shortLived.validateAndGetSubject(token))
                .isInstanceOf(Exception.class);
    }

    @Test
    void validate_tamperedToken_throws() {
        String token = jwtUtil.generate("carol");
        String tampered = token.substring(0, token.length() - 4) + "XXXX";
        assertThatThrownBy(() -> jwtUtil.validateAndGetSubject(tampered))
                .isInstanceOf(Exception.class);
    }

    @Test
    void validate_differentSecret_throws() {
        String token = jwtUtil.generate("dave");
        JwtUtil other = new JwtUtil("completely-different-secret-32-plusss", 3600L);
        assertThatThrownBy(() -> other.validateAndGetSubject(token))
                .isInstanceOf(Exception.class);
    }
}
