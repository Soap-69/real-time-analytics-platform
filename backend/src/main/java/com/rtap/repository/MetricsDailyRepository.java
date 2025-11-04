package com.rtap.repository;

import com.rtap.dto.DailyMetricDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Repository
public class MetricsDailyRepository {
    private final JdbcTemplate jdbc;

    public MetricsDailyRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<DailyMetricDTO> findRange(String name, LocalDate from, LocalDate to) {
        String sql = """
            select metric_date, metric_name, metric_value
            from metrics_daily
            where metric_name = ?
              and metric_date between ? and ?
            order by metric_date
        """;

        return jdbc.query(
                sql,
                new Object[]{ name, Date.valueOf(from), Date.valueOf(to) },
                (rs, rowNum) -> new DailyMetricDTO(
                        rs.getDate("metric_date").toLocalDate(),
                        rs.getString("metric_name"),
                        rs.getBigDecimal("metric_value")
                )
        );
    }
}
