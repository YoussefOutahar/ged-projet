package ma.sir.ged.exceptions;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Exception thrown when a bucket is not found.")
public class BucketNotFoundException extends RuntimeException {
    public BucketNotFoundException(String message) {
        super(message);
    }
}
