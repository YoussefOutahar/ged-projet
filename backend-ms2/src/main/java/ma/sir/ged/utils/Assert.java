package ma.sir.ged.utils;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Collection;

public interface Assert {
    static void assertNotNull(String value,String messageKey) throws IllegalArgumentException {
        if (value == null) {
            throw new IllegalArgumentException(messageKey);
        }
    }
    static void assertNotNullNumber(Long value,String messageKey) throws IllegalArgumentException {
        if (value == null) {
            throw new IllegalArgumentException(messageKey);
        }
    }

    static void assertNotEmptyString(String value, String messageKey) throws IllegalArgumentException {
        if (StringUtils.isEmpty(value)) {
            throw new IllegalArgumentException(messageKey);
        }
    }

    static void assertTrue(Boolean value, String messageKey) throws IllegalArgumentException {
        if (value == null || !value) {
            throw new IllegalArgumentException(messageKey);
        }
    }

    static void assertNotEmpty(Collection value, String messageKey) throws IllegalArgumentException {
        if (CollectionUtils.isEmpty(value)) {
            throw new IllegalArgumentException(messageKey);
        }
    }
}
