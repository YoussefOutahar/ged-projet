package ma.sir.ged.utils.LoggingUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.text.DecimalFormat;
import java.util.concurrent.TimeUnit;

@Component
public class TimeLogger {
    private static final Logger logger = LoggerFactory.getLogger(TimeLogger.class);
    private static final DecimalFormat decimalFormat = new DecimalFormat("#.##");
    private static final String IDENTIFIER_KEYWOARD = "TimeLogger";

    private long startTime;

    public void startLogging(String startMessage) {
        logger.info("{}: {}", IDENTIFIER_KEYWOARD, startMessage);
        this.startTime = System.currentTimeMillis();
    }

    public void endLogging(String endMessage) {
        long endTime = System.currentTimeMillis();
        double elapsedSeconds = (endTime - startTime) / 1000.0;
        String formattedTime = formatTime(elapsedSeconds);
        logger.warn("{}: {} in {}", IDENTIFIER_KEYWOARD, endMessage, formattedTime);
    }

    private String formatTime(double seconds) {
        long hours = TimeUnit.SECONDS.toHours((long) seconds);
        long minutes = TimeUnit.SECONDS.toMinutes((long) seconds) - TimeUnit.HOURS.toMinutes(hours);
        double remainingSeconds = seconds - TimeUnit.HOURS.toSeconds(hours) - TimeUnit.MINUTES.toSeconds(minutes);

        return hours + "h " + minutes + "m " + decimalFormat.format(remainingSeconds) + "s";
    }
}
