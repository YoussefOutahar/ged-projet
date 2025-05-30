package ma.sir.ged.exceptions;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Exception thrown when a facing an issue with Minio SDK.")
public class MinioException extends RuntimeException {
    public MinioException(String message) {
        super(message);
    }
}
