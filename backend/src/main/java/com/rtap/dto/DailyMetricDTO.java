package com.rtap.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyMetricDTO(LocalDate metricDate, String metricName, BigDecimal metricValue) {}
