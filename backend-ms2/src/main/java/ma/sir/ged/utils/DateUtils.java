package ma.sir.ged.utils;

import io.minio.errors.ErrorResponseException;
import org.apache.commons.lang3.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import org.joda.time.DateTime;


public interface DateUtils {
    static String format(Date date, String inPattern) {
        String result = null;
        if (date != null && inPattern != null) {
            SimpleDateFormat in = new SimpleDateFormat(inPattern);
            result = in.format(date);
        }
        return result;
    }

    static String format(Long timestamp, String inPattern) {
        String result = null;
        if (timestamp != null && inPattern != null) {
            Date date = new Date(timestamp);
            SimpleDateFormat in = new SimpleDateFormat(inPattern);
            result = in.format(date);
        }
        return result;
    }

    static String format(LocalDate date, String inPattern) {
        return format(asDate(date), inPattern);
    }

    static String formatWithFrench(String date, String inPattern, String outPattern) {
        String result = "";
        if (StringUtils.isNotEmpty(date) && StringUtils.isNotEmpty(inPattern) && StringUtils.isNotEmpty(outPattern)) {
            SimpleDateFormat in = new SimpleDateFormat(inPattern);
            SimpleDateFormat out = new SimpleDateFormat(outPattern, Locale.FRENCH);
            try {
                result = out.format(in.parse(date));
            } catch (ParseException e) {
                throw new IllegalArgumentException(e.getMessage());
            }
        }
        return result;

    }

    static String format(String date, String inPattern, String outPattern) {
        String result = "";
        if (StringUtils.isNotEmpty(date) && StringUtils.isNotEmpty(inPattern) && StringUtils.isNotEmpty(outPattern)) {
            SimpleDateFormat in = new SimpleDateFormat(inPattern);
            SimpleDateFormat out = new SimpleDateFormat(outPattern);
            try {
                result = out.format(in.parse(date));
            } catch (ParseException e) {
                throw new IllegalArgumentException(e.getMessage());
            }
        }
        return result;

    }


    static Date addMintues(Date date, int amount) {
        return org.apache.commons.lang3.time.DateUtils.addMinutes(date, amount);
    }

    static Date addSecondes(Date date, int amount) {
        return org.apache.commons.lang3.time.DateUtils.addSeconds(date, amount);
    }


    static Date asDate(LocalDate localDate) {
        if (localDate == null)
            return null;
        return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
    }

    static LocalDateTime asLocalDateTime(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    static Date asDate(String date, String inPattern) {
        Date result = null;
        if (StringUtils.isNotEmpty(date) && StringUtils.isNotEmpty(inPattern)) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(inPattern);
                result = asDate(LocalDate.parse(date, formatter));
            } catch (DateTimeParseException | IllegalArgumentException e) {
                throw new IllegalArgumentException(e.getMessage());
            }
        }
        return result;
    }

    static Date calculateIssueDate(Date date, int validityYears) {
        Date issueDate = org.apache.commons.lang3.time.DateUtils.addYears(date, validityYears);
        issueDate = org.apache.commons.lang3.time.DateUtils.setDays(issueDate, 1);
        issueDate = org.apache.commons.lang3.time.DateUtils.addMonths(issueDate, 1);
        issueDate = org.apache.commons.lang3.time.DateUtils.addDays(issueDate, -1);
        return issueDate;
    }

    static LocalDate parse(String date, String inPattern) {
        LocalDate result = null;
        if (StringUtils.isNotEmpty(date) && StringUtils.isNotEmpty(inPattern)) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(inPattern);
                result = LocalDate.parse(date, formatter);
            } catch (DateTimeParseException | IllegalArgumentException e) {
                throw new IllegalArgumentException(e.getMessage());
            }
        }
        return result;
    }

    static LocalDateTime parseAsLocalDateTime(String date, String inPattern) {
        LocalDateTime result = null;
        if (StringUtils.isNotEmpty(date) && StringUtils.isNotEmpty(inPattern)) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(inPattern);
                result = LocalDateTime.parse(date, formatter);
            } catch (DateTimeParseException | IllegalArgumentException e) {
                throw new IllegalArgumentException(e.getMessage());
            }
        }
        return result;
    }

    static long getAge(String date, String pattern) {
        LocalDate birthday = DateUtils.parse(date, pattern);
        return Period.between(birthday, LocalDate.now()).getYears();
    }

    static long mintutesSince(Date date) {
        return ChronoUnit.MINUTES.between(asLocalDateTime(date), LocalDateTime.now());
    }


    static long secondesSince(Date date) {
        return ChronoUnit.SECONDS.between(asLocalDateTime(date), LocalDateTime.now());
    }

    static long getMonth(String date, String pattern) {
        LocalDate birthday = DateUtils.parse(date, pattern);
        return ChronoUnit.MONTHS.between(birthday, LocalDate.now());
    }

    static long getDays(String date, String pattern) {
        LocalDate birthday = DateUtils.parse(date, pattern);
        return ChronoUnit.DAYS.between(birthday, LocalDate.now());
    }

    static int compare(String date1, String date2, String pattern) {
        return compare(asDate(parse(date1, pattern)), asDate(parse(date2, pattern)));
    }

    static int compare(Date date1, Date date2) {
        return org.apache.commons.lang3.time.DateUtils.truncatedCompareTo(date1, date2, Calendar.DAY_OF_MONTH);
    }

    static int compareByMonth(Date date1, Date date2) {
        return org.apache.commons.lang3.time.DateUtils.truncatedCompareTo(date1, date2, Calendar.MONTH);
    }

    static boolean isBefore(Date date1, Date date2) {
        return compare(date1, date2) < 0;
    }


    static int compare(LocalDate date1, LocalDate date2) {
        return date1.compareTo(date2);
    }


    static boolean isBefore(String date1, String date2, String pattern) {
        return compare(date1, date2, pattern) < 0;
    }

    static boolean isInbetween(String date1, String date2, String pattern) {
        String today = format(new Date(), pattern);
        return compare(date1, today, pattern) <= 0 && compare(date2, today, pattern) >= 0;
    }

    static boolean isDateValid(String date, String pattern) {
        if (StringUtils.isNotEmpty(date) && StringUtils.isNotEmpty(pattern)) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
                LocalDate.parse(date, formatter);
                return true;
            } catch (DateTimeParseException | IllegalArgumentException e) {
                return false;
            }
        }

        return false;
    }

    static Date getDateYearsAgo(int years) {
        return DateTime.now().minusYears(years).toDate();
    }

    static String getDateYearsAgoAsString(int years, String pattern) {
        return DateTime.now().minusYears(years).toString(pattern);
    }

    static String getDateMonthsAgoAsString(int months, String pattern) {
        return DateTime.now().minusMonths(months).toString(pattern);
    }

    static Date parseDateTime(String date, String pattern) {
        Date result = null;
        if (StringUtils.isNotEmpty(date) && StringUtils.isNotEmpty(pattern)) {
            SimpleDateFormat formatter = new SimpleDateFormat(pattern);
            try {
                result = formatter.parse(date);
            } catch (ParseException e) {
                throw new IllegalArgumentException(e.getMessage());
            }
        }
        return result;
    }

    static Long time(Date date) {
        return date != null ? date.getTime() : null;
    }

}
