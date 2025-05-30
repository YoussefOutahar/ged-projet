package ma.sir.ged.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Collections;
import java.util.List;

@Component("CacheKeyGenerator")
public class CacheKeyGenerator implements KeyGenerator {

    private static final List<String> BLACKLIST = Collections.singletonList("DocumentAdminServiceImpl");

    @NotNull
    @Override
    public Object generate(Object target, @NotNull Method method, @NotNull Object... params) {
        StringBuilder sb = new StringBuilder();

        String className = target.getClass().getSimpleName();

        if (className.contains("$$")) {
            className = className.substring(0, className.indexOf("$$"));
        }

        sb.append(className);
        sb.append('-');
        sb.append(method.getName());

        if (BLACKLIST.contains(className)) {
            return null;
        }

        System.out.println("Cache key: " + sb.toString());
        return sb.toString();
    }
}
