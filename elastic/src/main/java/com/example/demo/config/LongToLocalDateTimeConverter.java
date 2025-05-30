package com.example.demo.config;

import org.springframework.core.convert.converter.Converter;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class LongToLocalDateTimeConverter implements Converter<Long, LocalDate> {
    @Override
    public LocalDate convert(Long source) {
        return Instant.ofEpochMilli(source).atZone(ZoneId.systemDefault()).toLocalDate();
    }
}
