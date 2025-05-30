package ma.sir.ged.config.Cache;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

import java.util.Collection;
import java.util.concurrent.Callable;

public class CustomCacheManager implements CacheManager {
    private final CacheManager delegate;

    public CustomCacheManager() {
        this.delegate = new ConcurrentMapCacheManager();
    }

    @Override
    public Cache getCache(String name) {
        Cache delegateCache = delegate.getCache(name);
        return new CustomCache(delegateCache);
    }

    @Override
    public Collection<String> getCacheNames() {
        return delegate.getCacheNames();
    }

    private static class CustomCache implements Cache {

        private final Cache delegate;

        public CustomCache(Cache delegate) {
            this.delegate = delegate;
        }

        @Override
        public String getName() {
            return delegate.getName();
        }

        @Override
        public Object getNativeCache() {
            return delegate.getNativeCache();
        }

        @Override
        public ValueWrapper get(Object key) {
            return delegate.get(key);
        }

        @Override
        public <T> T get(Object key, Class<T> type) {
            return delegate.get(key, type);
        }

        @Override
        public <T> T get(Object key, Callable<T> valueLoader) {
            return delegate.get(key, valueLoader);
        }

        @Override
        public void put(Object key, Object value) {
            delegate.put(key, value);
        }

        @Override
        public ValueWrapper putIfAbsent(Object key, Object value) {
            return delegate.putIfAbsent(key, value);
        }

        @Override
        public void evict(Object key) {
            System.out.println("Evicting key: " + key + " from cache: " + getName());
            delegate.evict(key);
        }

        @Override
        public void clear() {
            System.out.println("Clearing cache: " + getName());
            delegate.clear();
        }
    }
}
