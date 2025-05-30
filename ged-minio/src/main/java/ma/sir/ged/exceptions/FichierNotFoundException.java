package ma.sir.ged.exceptions;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Exception thrown when a file is not found.")
public class FichierNotFoundException extends RuntimeException {
    public FichierNotFoundException(String message) {
        super(message);
    }
}
