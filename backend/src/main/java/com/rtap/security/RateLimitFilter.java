package com.rtap.security;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.connection.RedisStringCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

/**
 * Simple fixed-window limiter:
 * key = rl:{path}:{ip}:{epochMinute}
 * limit = 60 requests per minute per IP per path.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redis;
    private final Counter throttledCounter;
    private final int limitPerMinute;

    public RateLimitFilter(StringRedisTemplate redis, MeterRegistry meterRegistry, int limitPerMinute) {
        this.redis = redis;
        this.limitPerMinute = limitPerMinute;
        this.throttledCounter = Counter.builder("rtap_rate_limited_total")
                .description("Total requests throttled by rate limiter")
                .register(meterRegistry);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Only rate-limit the event ingest endpoint
        return !("/api/v1/events".equals(request.getRequestURI())
                && "POST".equalsIgnoreCase(request.getMethod()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String ip = clientIp(req);
        long minute = Instant.now().getEpochSecond() / 60;
        String key = "rl:/api/v1/events:" + ip + ":" + minute;

        // INCR key; if created set EXPIRE 60; then check value
        Long count = redis.opsForValue().increment(key);
        if (count != null && count == 1L) {
            // key was just created, set expiry
            redis.expire(key, 60, TimeUnit.SECONDS);
        }


        if (count != null && count > limitPerMinute) {
            throttledCounter.increment();
            res.setStatus(429);
            res.setContentType("application/json");
            res.getWriter().write("{\"error\":\"rate_limited\",\"detail\":\"Too many requests. Try again in a minute.\"}");
            return;
        }

        chain.doFilter(req, res);
    }

    private static String clientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}
