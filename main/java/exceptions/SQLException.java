package exceptions;

public class SQLException extends Exception{
    public SQLException() {
        super();
    }

    public SQLException(String message) {
        super(message);
    }

    public SQLException(String message, Throwable cause) {
        super(message, cause);
    }

    public SQLException(Throwable cause) {
        super(cause);
    }

    protected SQLException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
