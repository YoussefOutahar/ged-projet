package ma.sir.ged.aop;


import ma.sir.ged.aop.annotations.LogTime;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Base64;
import java.util.stream.Collectors;

import static ma.sir.ged.aop.util.LoggingUtils.withLogTime;

@Aspect
@Component
public class LoggingAspect {

    @Pointcut(
            "within(@org.springframework.stereotype.Repository *)" +
                    " || within(@org.springframework.stereotype.Service *)" +
                    " || within(@org.springframework.web.bind.annotation.RestController *)"
    )
    public void springBeanPointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }


    @Pointcut(
            "within(ma.sir.ged.dao.*)" +
                    " || within(ma.sir.ged.service..*)" +
                    " || within(ma.sir.ged.ws..*)"
    )
    public void applicationPackagePointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }


    private Logger logger(JoinPoint joinPoint) {
        return LoggerFactory.getLogger(joinPoint.getSignature().getDeclaringTypeName());
    }


    @AfterThrowing(pointcut = "applicationPackagePointcut() && springBeanPointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        logger(joinPoint)
                .error(
                        "Exception in {}() with cause = '{}' and exception = '{}'",
                        joinPoint.getSignature().getName(),
                        e.getCause() != null ? e.getCause() : "NULL",
                        e.getMessage(),
                        e
                );
    }

    @Around("applicationPackagePointcut() && springBeanPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        final Logger log = logger(joinPoint);
        if (log.isDebugEnabled()) {
            log.info(
                    "Enter: {}()",
                    joinPoint.getSignature().getName()
//                    handleBigArguments(joinPoint.getArgs())
            );
        }
        try {
            final Object result = joinPoint.proceed();
            if (log.isDebugEnabled()) {
                log.info("Exit: {}()",
                        joinPoint.getSignature().getName()
//                        handleResultArguments(result)
                );
            }
            return result;
        } catch (IllegalArgumentException e) {
            log.error(
                    "Illegal argument: {} in {}()",
                    handleBigArguments(joinPoint.getArgs()),
                    joinPoint.getSignature().getName()
            );
            throw e;
        }
    }

    private String handleBigArguments(Object[] args) {
        return Arrays.stream(args)
                .map(arg -> {
                    if (arg == null) {
                        return "null";
                    } else if (arg instanceof byte[] || arg instanceof java.io.InputStream) {
                        return "[byte array omitted]";
                    } else if (arg instanceof String && isBase64((String) arg)) {
                        return "[Base64 data omitted]";
                    }  else {
                        return arg.toString();
                    }
                })
                .collect(Collectors.joining(", "));
    }

    private String handleResultArguments(Object object) {
        if (object == null) {
            return "null";
        } else if (object instanceof byte[] || object instanceof java.io.InputStream) {
            return "[large data omitted]";
        } else if (object instanceof String && isBase64((String) object)) {
            return "[Base64 data omitted]";
        }  else {
            return object.toString();
        }
    }

    private boolean isBase64(String s) {
        try {
            Base64.getDecoder().decode(s);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    @Around("@annotation(logTime)")
    public Object logTime(ProceedingJoinPoint joinPoint, LogTime logTime) {
        return withLogTime(logTime.prefix() + " " + joinPoint.getSignature().getName(),
                () -> proceedJoinPoint(joinPoint),
                logTime.timeUnit());
    }

    private static Object proceedJoinPoint(ProceedingJoinPoint joinPoint) {
        try {
            return joinPoint.proceed();
        } catch (Throwable e) {
            return null;
        }
    }
}
