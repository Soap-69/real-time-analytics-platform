package com.rtap.controller;

import com.rtap.dto.DailyMetricDTO;
import com.rtap.repository.MetricsDailyRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/metrics")
public class MetricsController {

    private final MetricsDailyRepository repo;

    public MetricsController(MetricsDailyRepository repo) {
        this.repo = repo;
    }
   /* @Cacheable(cacheNames = "metricsDaily",
            key = "#name + ':' + #from.toString() + ':' + #to.toString()")*/
    @GetMapping("/daily")
    public ResponseEntity<?> getDaily(
            @RequestParam String name,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (to.isBefore(from)) {
            return ResponseEntity.badRequest().body(Map.of("error", "`to` must be on/after `from`"));
        }
        List<DailyMetricDTO> points = repo.findRange(name, from, to);
        return ResponseEntity.ok(Map.of("name", name, "from", from, "to", to, "points", points));
    }
}
