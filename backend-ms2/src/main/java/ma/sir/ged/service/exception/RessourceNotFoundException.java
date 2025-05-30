package ma.sir.ged.service.exception;

public class RessourceNotFoundException  extends RuntimeException {

    private String[] params;

    public RessourceNotFoundException(String message) {
        super(message);
    }

    public RessourceNotFoundException(String message, String[] params) {
        super(message);
        this.params = params;
    }

    public RessourceNotFoundException(Throwable cause) {
        super(cause);
    }

    public RessourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public String[] getParams() {
        return params;
    }

    public void setParams(String[] params) {
        this.params = params;
    }

}
