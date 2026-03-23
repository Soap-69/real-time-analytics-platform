-- Additional tables not managed by JPA/Hibernate, needed at test startup
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS metrics_daily (
    metric_date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    PRIMARY KEY (metric_date, metric_name)
);
