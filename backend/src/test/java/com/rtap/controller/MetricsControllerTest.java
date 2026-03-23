package com.rtap.controller;

import com.rtap.dto.DailyMetricDTO;
import com.rtap.repository.MetricsDailyRepository;
import com.rtap.security.JwtUtil;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MetricsController.class)
class MetricsControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    MetricsDailyRepository repo;

    @MockBean
    JwtUtil jwtUtil;

    @MockBean
    StringRedisTemplate stringRedisTemplate;

    @MockBean
    MeterRegistry meterRegistry;

    @Test
    @WithMockUser
    void getDaily_toBeforeFrom_returns400() throws Exception {
        mvc.perform(get("/api/v1/metrics/daily")
                        .param("name", "DAU")
                        .param("from", "2024-01-10")
                        .param("to", "2024-01-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser
    void getDaily_validRange_returnsPoints() throws Exception {
        when(repo.findRange(eq("DAU"), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(new DailyMetricDTO(LocalDate.of(2024, 1, 1), "DAU", BigDecimal.valueOf(42))));

        mvc.perform(get("/api/v1/metrics/daily")
                        .param("name", "DAU")
                        .param("from", "2024-01-01")
                        .param("to", "2024-01-07"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("DAU"))
                .andExpect(jsonPath("$.points").isArray())
                .andExpect(jsonPath("$.points[0].metricValue").value(42.0));
    }

    @Test
    @WithMockUser
    void getDaily_sameDayRange_returnsOk() throws Exception {
        when(repo.findRange(any(), any(), any())).thenReturn(List.of());

        mvc.perform(get("/api/v1/metrics/daily")
                        .param("name", "EVENTS_TOTAL")
                        .param("from", "2024-03-01")
                        .param("to", "2024-03-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.points").isArray());
    }
}
