package ma.sir.ged.exceptions;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Exception thrown when a version is not found for a specific file.")
public class VersionNotFoundException extends RuntimeException {
    public VersionNotFoundException(String message) {
        super(message);
    }
}
