
package ma.sir.ged.aop.util;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

public class LoggingUtils {

    private static Logger log = LoggerFactory.getLogger(LoggingUtils.class);


    public static final int THOUSAND_MS = 1000;

    public static final int HOUR_IN_MINUTES = 60;

    public static final int HOUR_IN_SEC = 3600;

    public static final int HOURS_IN_DAY = 24;

    private LoggingUtils() {
    }

    public static <T> T withLogTime(String methodName, Runnable runnable) {
        return withLogTime(methodName, runnable, TimeUnit.MILLISECONDS);
    }

    public static <T> T withLogTime(String methodName, Runnable runnable, TimeUnit timeUnit) {
        return withLogTime(methodName, () -> {
            runnable.run();
            return null;
        }, timeUnit);
    }

    public static <T> T withLogTime(String methodName, Supplier<T> runnable) {
        return withLogTime(methodName, runnable, TimeUnit.MILLISECONDS);
    }

    public static <T> T withLogTime(String methodName, Supplier<T> runnable, TimeUnit timeUnit) {
        log.info(methodName + " is invoked");
        final long start = System.currentTimeMillis();
        T object = runnable.get();
        final long time = System.currentTimeMillis() - start;
        log.info(methodName + " took " + convertTime(time, timeUnit));

        return object;
    }

    public static String convertTime(long time, TimeUnit timeUnit) {
        String convertedTime;
        switch (timeUnit) {
            case SECONDS:
                convertedTime = time / THOUSAND_MS + " s";
                break;
            case MINUTES:
                convertedTime = (time / THOUSAND_MS) / HOUR_IN_MINUTES + " min";
                break;
            case HOURS:
                convertedTime = (time / THOUSAND_MS) / HOUR_IN_SEC + " hrs";
                break;
            case DAYS:
                convertedTime = (time / THOUSAND_MS) / (HOUR_IN_SEC * HOURS_IN_DAY) + " d";
                break;
            default:
                convertedTime = time + " ms";
                break;
        }
        return convertedTime;
    }
}
