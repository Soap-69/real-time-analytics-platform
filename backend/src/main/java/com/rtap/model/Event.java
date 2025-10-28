package com.rtap.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.Map;

@Entity
@Table(name = "events_raw")
@Data
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "session_id")
    private String sessionId;

    @Column(columnDefinition = "jsonb")
    @Convert(converter = MapToJsonConverter.class)
    private Map<String, Object> payload;

    @Column(name = "occurred_at")
    private OffsetDateTime occurredAt = OffsetDateTime.now();

    @Column(name = "received_at")
    private OffsetDateTime receivedAt = OffsetDateTime.now();
}
