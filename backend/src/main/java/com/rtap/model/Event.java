package com.rtap.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

// Hibernate JSON support
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "events_raw")
@Data
@NoArgsConstructor  // <-- important for JPA/Jackson
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

    // Store as real JSON (jsonb) in Postgres using Hibernate 6 type
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> payload = new HashMap<>();

    @Column(name = "occurred_at")
    private OffsetDateTime occurredAt = OffsetDateTime.now();

    @Column(name = "received_at")
    private OffsetDateTime receivedAt = OffsetDateTime.now();
}
