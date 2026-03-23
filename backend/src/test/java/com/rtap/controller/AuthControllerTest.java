package com.rtap.controller;

import com.rtap.security.JwtUtil;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    JwtUtil jwtUtil;

    @MockBean
    StringRedisTemplate stringRedisTemplate;

    @MockBean
    MeterRegistry meterRegistry;

    @Test
    @WithMockUser
    void login_validCredentials_returnsToken() throws Exception {
        when(jwtUtil.generate("Esun")).thenReturn("mocked-jwt-token");

        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"Esun\",\"password\":\"Esunadmin\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"));
    }

    @Test
    @WithMockUser
    void login_wrongPassword_returns401() throws Exception {
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"Esun\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("invalid credentials"));
    }

    @Test
    @WithMockUser
    void login_missingUsername_returns400() throws Exception {
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"Esunadmin\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void login_regexInput_doesNotBypassAuth() throws Exception {
        // Ensures .equals() is used — a regex wildcard must NOT produce a token
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\".*\",\"password\":\".*\"}"))
                .andExpect(status().isUnauthorized());
    }
}
